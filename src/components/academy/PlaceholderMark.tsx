import Image from "next/image";

/**
 * Quiet GS mark for video cards that have no thumbnail yet.
 *
 * Only rendered when a lesson has no video uploaded — once `thumbnailUrl`
 * exists the real first frame takes over and this must not sit on top of it.
 * Kept at low opacity deliberately: a grid of 32 lessons is a lot of repeats
 * of the same mark, and it has to sit quietly next to real thumbnails as the
 * curriculum fills in rather than competing with them.
 */
export function PlaceholderMark({ tone = "dark" }: { tone?: "dark" | "light" }) {
  return (
    <span aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <Image
        src={tone === "dark" ? "/logo-green.png" : "/logo-cream.png"}
        alt=""
        width={120}
        height={126}
        className={`w-[32%] max-w-[92px] ${tone === "dark" ? "opacity-[0.09]" : "opacity-[0.13]"}`}
      />
    </span>
  );
}
