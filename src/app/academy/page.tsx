import { createClient } from "@/lib/supabase/server";
import { LoginScreen } from "@/components/academy/LoginScreen";
import { AcademyLibrary } from "@/components/academy/AcademyLibrary";

export default async function AcademyPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-cream">
      {user ? <AcademyLibrary creatorEmail={user.email ?? ""} /> : <LoginScreen />}
    </div>
  );
}
