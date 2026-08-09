// The handoff specifies 1240px, which reads as a narrow floating column on a
// 1920 display (340px of dead space each side). Widened to 1440 so large
// monitors are filled without letting text lines run too long — deliberate
// deviation from the spec, flagged for the designer.
export const CONTAINER = "mx-auto max-w-[1440px] px-[clamp(20px,5vw,48px)]";
