import React from "react";
import { colors, fonts, fontSize } from "../../design/tokens";
import { SpringFadeIn } from "./SpringFadeIn";

export const SectionLabel: React.FC<{
  text: string;
  delay?: number;
  color?: string;
}> = ({ text, delay = 0, color = colors.accent }) => {
  return (
    <SpringFadeIn delay={delay} direction="up">
      <div
        style={{
          fontFamily: fonts.mono,
          fontSize: fontSize.sm,
          fontWeight: 600,
          color,
          textTransform: "uppercase",
          letterSpacing: 3,
        }}
      >
        {text}
      </div>
    </SpringFadeIn>
  );
};
