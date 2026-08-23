"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

/**
 * Click-to-edit name in the Academy header.
 *
 * The set-password screen captures a name for newly invited creators, but
 * anyone who signed up before that existed has no way to set one — and
 * sending them through a password reset just to add a name would be absurd.
 * This gives everyone a way in.
 *
 * Writes to the auth user's own metadata, so a creator can only ever change
 * their own name; there's no id to tamper with.
 */
export function DisplayNameEditor({
  displayName,
  hasCustomName,
}: {
  displayName: string;
  hasCustomName: boolean;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(hasCustomName ? displayName : "");
  const [saving, setSaving] = useState(false);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) {
      setEditing(false);
      return;
    }

    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ data: { display_name: trimmed } });
    setSaving(false);

    if (error) return; // Stay open so the typed name isn't lost.

    setEditing(false);
    // The name is rendered by the server component above, so re-fetch rather
    // than duplicating it in local state.
    router.refresh();
  };

  if (!editing) {
    return (
      <button
        type="button"
        onClick={() => setEditing(true)}
        title="Change your name"
        className="hidden cursor-pointer border-none bg-transparent p-0 text-sm font-semibold text-ink transition-colors hover:text-green md:inline"
      >
        {displayName}
      </button>
    );
  }

  return (
    <form onSubmit={save} className="hidden items-center gap-1.5 md:flex">
      <input
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={save}
        onKeyDown={(e) => {
          if (e.key === "Escape") setEditing(false);
        }}
        placeholder="Your name"
        aria-label="Your name"
        className="w-[130px] rounded-lg border border-ink/20 bg-cream-card px-2 py-1 text-sm font-semibold text-ink outline-none focus:border-green/50"
      />
      <button
        type="submit"
        disabled={saving}
        className="cursor-pointer rounded-lg border-none bg-green px-2.5 py-1 text-[12px] font-semibold text-cream disabled:opacity-60"
      >
        {saving ? "…" : "Save"}
      </button>
    </form>
  );
}
