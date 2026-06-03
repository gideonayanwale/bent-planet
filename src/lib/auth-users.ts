import { createAdminClient } from "@/lib/supabase/admin";

type AdminClient = ReturnType<typeof createAdminClient>;

type ChurchAuthUserInput = {
  email: string;
  password: string;
  adminName: string;
  churchName: string;
};

async function findAuthUserByEmail(adminClient: AdminClient, email: string) {
  let page = 1;

  while (true) {
    const { data, error } = await adminClient.auth.admin.listUsers({
      page,
      perPage: 200,
    });

    if (error) {
      throw new Error(`Failed to search auth users: ${error.message}`);
    }

    const existingUser = data.users.find(
      (user) => user.email?.toLowerCase() === email.toLowerCase(),
    );

    if (existingUser) {
      return existingUser;
    }

    if (!data.nextPage) {
      return null;
    }

    page = data.nextPage;
  }
}

export async function upsertChurchAuthUser(
  adminClient: AdminClient,
  input: ChurchAuthUserInput,
) {
  const existingUser = await findAuthUserByEmail(adminClient, input.email);

  const attributes = {
    email: input.email,
    password: input.password,
    email_confirm: true,
    user_metadata: {
      name: input.adminName,
      church_name: input.churchName,
    },
  };

  if (existingUser) {
    const { error } = await adminClient.auth.admin.updateUserById(existingUser.id, attributes);

    if (error) {
      throw new Error(`Failed to update auth user: ${error.message}`);
    }

    return existingUser.id;
  }

  const { data, error } = await adminClient.auth.admin.createUser(attributes);

  if (error || !data.user) {
    throw new Error(error?.message ?? "Failed to create auth user.");
  }

  return data.user.id;
}
