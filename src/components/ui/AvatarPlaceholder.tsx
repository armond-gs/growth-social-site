/**
 * Derives up to two initials from a display name.
 *
 * Names here come from the local part of an email ("armond.mendiola",
 * "noel-r", "joey+test"), so word boundaries are punctuation and digits
 * rather than spaces — splitting on those gives "AM" instead of "A".
 */
function getInitials(name: string): string {
  const parts = name
    .split(/[^\p{L}]+/u)
    .filter(Boolean)
    .slice(0, 2);
  if (parts.length === 0) return "";
  return parts.map((p) => p[0]).join("").toUpperCase();
}

/**
 * Avatar for a creator. Shows their initials when a name is available, and
 * falls back to the neutral striped circle when it isn't — the fallback is
 * still used by any caller that has no name to work with.
 */
export function AvatarPlaceholder({ size = 40, name }: { size?: number; name?: string }) {
  const initials = name ? getInitials(name) : "";

  if (!initials) {
    return (
      <span
        className="inline-block flex-none rounded-full border border-ink/10 bg-[repeating-linear-gradient(135deg,#e6e6da_0_6px,#efefe6_6px_12px)]"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className="inline-flex flex-none items-center justify-center rounded-full bg-green font-semibold text-cream select-none"
      // Scaled off the circle rather than fixed, so the same component works
      // at the 32px nav size and larger.
      style={{ width: size, height: size, fontSize: Math.round(size * 0.4) }}
    >
      {initials}
    </span>
  );
}
