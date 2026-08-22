"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireChurchUser } from "@/lib/current-user";
import { getChurchByAdminEmail } from "@/lib/churches";

export interface BulkImportItem {
  fullName: string;
  email: string;
  phone?: string;
}

export async function bulkImportSubscribersAction(
  items: BulkImportItem[],
  overwriteConflicts: boolean = false
) {
  try {
    const user = await requireChurchUser();
    const adminClient = createAdminClient();

    const church = await getChurchByAdminEmail(adminClient, user.email!);
    if (!church) {
      return { error: "Church workspace not found." };
    }

    if (!items || items.length === 0) {
      return { error: "No subscriber records provided." };
    }

    // Fetch existing subscribers for deduplication & reconciliation
    const { data: existingSubscribers } = await adminClient
      .from("subscribers")
      .select("email, phone, full_name")
      .eq("church_id", church.id);

    const existingMap = new Map(existingSubscribers?.map((s) => [s.email.toLowerCase(), s]) || []);

    let newCount = 0;
    let mergedCount = 0;

    // Deduplicate in payload first
    const emailMap = new Map<string, BulkImportItem>();
    for (const item of items) {
      const email = item.email.trim().toLowerCase();
      if (email && email.includes("@")) {
        if (!emailMap.has(email)) {
          emailMap.set(email, {
            fullName: item.fullName.trim() || "Member",
            email,
            phone: item.phone?.trim() || undefined,
          });
        } else {
          // Merge missing phone if existing didn't have one
          const existing = emailMap.get(email)!;
          if (!existing.phone && item.phone) {
            existing.phone = item.phone.trim();
          }
        }
      }
    }

    const recordsToInsert = Array.from(emailMap.values()).map((item) => {
      const existing = existingMap.get(item.email);
      if (existing) {
        mergedCount++;
        return {
          church_id: church.id,
          full_name: overwriteConflicts ? item.fullName : existing.full_name || item.fullName,
          email: item.email,
          phone: overwriteConflicts ? (item.phone || existing.phone) : (existing.phone || item.phone || null),
          unsubscribed: false,
        };
      } else {
        newCount++;
        return {
          church_id: church.id,
          full_name: item.fullName,
          email: item.email,
          phone: item.phone || null,
          unsubscribed: false,
        };
      }
    });

    // Upsert on conflict (church_id, email)
    const { error: upsertError } = await adminClient
      .from("subscribers")
      .upsert(recordsToInsert, { onConflict: "church_id, email" });

    if (upsertError) {
      console.error("Bulk subscriber upsert error:", upsertError);
      return { error: `Failed to import subscribers: ${upsertError.message}` };
    }

    revalidatePath("/dashboard/subscribers");
    revalidatePath("/dashboard");

    return { success: true, count: recordsToInsert.length, inserted: newCount, merged: mergedCount, failed: 0 };
  } catch (error: unknown) {
    const err = error as Error;
    console.error("bulkImportSubscribersAction error:", err);
    return { error: err.message || "Failed to import subscribers." };
  }
}


export async function deleteSubscriberAction(subscriberId: string) {
  try {
    const user = await requireChurchUser();
    const adminClient = createAdminClient();

    const church = await getChurchByAdminEmail(adminClient, user.email!);
    if (!church) {
      return { error: "Church workspace not found." };
    }

    // Clean up email_log reference first if needed
    await adminClient.from("email_log").delete().eq("subscriber_id", subscriberId).eq("church_id", church.id);

    const { error } = await adminClient
      .from("subscribers")
      .delete()
      .eq("id", subscriberId)
      .eq("church_id", church.id);

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/dashboard/subscribers");
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error: unknown) {
    const err = error as Error;
    return { error: err.message || "Failed to delete subscriber." };
  }
}
