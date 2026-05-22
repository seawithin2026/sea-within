export function evolveAura(bloomLevel: number, element: string) {
  // LEVEL-BASED AURA
  let levelClass = "";
  if (bloomLevel <= 1) levelClass = "aura-soft";
  else if (bloomLevel <= 3) levelClass = "aura-warm";
  else if (bloomLevel <= 6) levelClass = "aura-deep";
  else levelClass = "aura-luminous";

  // ELEMENT-BASED COLOR VARIANT
  let elementClass = "";
  switch (element) {
    case "earth":
      elementClass = "aura-earth";
      break;
    case "air":
      elementClass = "aura-air";
      break;
    case "fire":
      elementClass = "aura-fire";
      break;
    case "water":                // ⭐ updated from "light"
      elementClass = "aura-water";
      break;
    default:
      elementClass = "aura-water"; // ⭐ fallback
  }

  // ⭐ THIS MUST BE OUTSIDE THE SWITCH
  return {
    auraClass: `${levelClass} ${elementClass}`,
  };
}
