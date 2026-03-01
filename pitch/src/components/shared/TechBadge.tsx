import React from "react";
import { colors, fonts, fontSize } from "../../design/tokens";
import { SpringFadeIn } from "./SpringFadeIn";

export const TechBadge: React.FC<{
  text: string;
  delay?: number;
}> = ({ text, delay = 0 }) => {
  return (
    <SpringFadeIn delay={delay} direction="up">
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          padding: "6px 16px",
          borderRadius: 999,
          background: colors.whiteAlpha10,
          border: `1px solid ${colors.whiteAlpha20}`,
          fontFamily: fonts.mono,
          fontSize: fontSize.sm,
          fontWeight: 500,
          color: colors.accent,
        }}
      >
        {text}
      </div>
    </SpringFadeIn>
  );
};
