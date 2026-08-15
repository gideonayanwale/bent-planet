import { requireChurchUser } from "@/lib/current-user";
import { getChurchByAdminEmail } from "@/lib/churches";
import { createAdminClient } from "@/lib/supabase/admin";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { saveChurchSettings } from "./actions";

export default async function ChurchSettingsPage() {
  const user = await requireChurchUser();
  const adminClient = createAdminClient();
  const church = await getChurchByAdminEmail(adminClient, user.email!);

  if (!church) return <div>Church not found</div>;

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      <div>
        <h1 className="text-3xl font-bold font-heading text-slate-900">Workspace Settings</h1>
        <p className="text-slate-600 mt-1">Manage your church profile, branding, and social links.</p>
      </div>

      <form action={saveChurchSettings} className="space-y-8">
        
        {/* Church Profile */}
        <Card className="border-slate-200/70 shadow-sm bg-white/90">
          <CardHeader>
            <CardTitle>Church Profile</CardTitle>
            <CardDescription>Public information displayed on your Bent Planet page.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Church Name</Label>
                <Input id="name" name="name" defaultValue={church.name} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Profile Slug (Read-only)</Label>
                <Input id="slug" defaultValue={church.slug} disabled className="bg-slate-50" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Biography / Welcome Message</Label>
              <Textarea id="bio" name="bio" defaultValue={church.bio || ""} rows={4} placeholder="Welcome to our digital home..." />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input id="country" name="country" defaultValue={church.country || ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Input id="timezone" name="timezone" defaultValue={church.timezone || "Africa/Lagos"} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Social Links */}
        <Card className="border-slate-200/70 shadow-sm bg-white/90">
          <CardHeader>
            <CardTitle>Social Links</CardTitle>
            <CardDescription>Connect with your attendees across platforms.</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="instagram_url">Instagram URL</Label>
              <Input id="instagram_url" name="instagram_url" type="url" defaultValue={church.instagram_url || ""} placeholder="https://instagram.com/..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="facebook_url">Facebook URL</Label>
              <Input id="facebook_url" name="facebook_url" type="url" defaultValue={church.facebook_url || ""} placeholder="https://facebook.com/..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="youtube_url">YouTube URL</Label>
              <Input id="youtube_url" name="youtube_url" type="url" defaultValue={church.youtube_url || ""} placeholder="https://youtube.com/..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp_url">WhatsApp Group URL</Label>
              <Input id="whatsapp_url" name="whatsapp_url" type="url" defaultValue={church.whatsapp_url || ""} placeholder="https://chat.whatsapp.com/..." />
            </div>
          </CardContent>
        </Card>

        {/* Admin Details */}
        <Card className="border-slate-200/70 shadow-sm bg-white/90">
          <CardHeader>
            <CardTitle>Admin Details</CardTitle>
            <CardDescription>Internal contact information for this workspace.</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="admin_name">Admin Name</Label>
              <Input id="admin_name" name="admin_name" defaultValue={church.admin_name || ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin_email">Admin Email (Read-only)</Label>
              <Input id="admin_email" defaultValue={church.admin_email} disabled className="bg-slate-50" />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" size="lg" className="w-full md:w-auto shadow-md">
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
