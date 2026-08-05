import { createClient } from "@/lib/supabase/server";
import { getCurriculum, getContinueWatching } from "@/lib/supabase/academy-queries";
import { getCoaches } from "@/lib/supabase/coach-queries";
import { getProgressPercent } from "@/lib/academy/types";
import { LoginScreen } from "@/components/academy/LoginScreen";
import { AcademyLibrary } from "@/components/academy/AcademyLibrary";

export default async function AcademyPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="min-h-screen bg-cream">
        <LoginScreen />
      </div>
    );
  }

  const modules = await getCurriculum(user.id);
  const [continueWatching, coaches] = await Promise.all([
    getContinueWatching(user.id, modules),
    getCoaches(user.id),
  ]);
  const progressPercent = getProgressPercent(modules);

  return (
    <div className="min-h-screen bg-cream">
      <AcademyLibrary
        creatorEmail={user.email ?? ""}
        modules={modules}
        continueWatching={continueWatching}
        progressPercent={progressPercent}
        coaches={coaches}
      />
    </div>
  );
}
