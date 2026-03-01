import React from "react";
import { colors, fonts, fontSize } from "../../design/tokens";
import { SpringFadeIn } from "./SpringFadeIn";

export const SectionTitle: React.FC<{
  text: string;
  delay?: number;
  size?: number;
  color?: string;
  maxWidth?: number;
}> = ({
  text,
  delay = 5,
  size = fontSize["5xl"],
  color = colors.white,
  maxWidth,
}) => {
  return (
    <SpringFadeIn delay={delay} direction="up">
      <div
        style={{
          fontFamily: fonts.heading,
          fontSize: size,
          fontWeight: 800,
          color,
          lineHeight: 1.2,
          maxWidth,
        }}
      >
        {text}
      </div>
    </SpringFadeIn>
  );
};
