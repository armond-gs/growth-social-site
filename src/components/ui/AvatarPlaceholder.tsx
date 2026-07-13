export function AvatarPlaceholder({ size = 40 }: { size?: number }) {
  return (
    <span
      className="inline-block flex-none rounded-full border border-ink/10 bg-[repeating-linear-gradient(135deg,#e6e6da_0_6px,#efefe6_6px_12px)]"
      style={{ width: size, height: size }}
    />
  );
}
