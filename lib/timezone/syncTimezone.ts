import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export async function syncTimezone() {
  const supabase = createClientComponentClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  await supabase
    .from('profiles')
    .update({ timezone })
    .eq('id', user.id);
}
