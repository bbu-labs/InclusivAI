import React from "react";
import { colors, fonts, fontSize } from "../../design/tokens";
import { SpringFadeIn } from "./SpringFadeIn";
import { CountUpNumber } from "./CountUpNumber";

export const StatCard: React.FC<{
  icon: React.ReactNode;
  number: number;
  suffix?: string;
  label: string;
  delay?: number;
  decimals?: number;
  numberColor?: string;
}> = ({
  icon,
  number,
  suffix = "",
  label,
  delay = 0,
  decimals = 0,
  numberColor = colors.secondary,
}) => {
  return (
    <SpringFadeIn delay={delay} direction="up">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
          padding: "24px 20px",
          background: colors.whiteAlpha10,
          borderRadius: 16,
          border: `1px solid ${colors.whiteAlpha10}`,
          backdropFilter: "blur(10px)",
          minWidth: 200,
        }}
      >
        <div style={{ fontSize: 32, color: colors.accent }}>{icon}</div>
        <div
          style={{
            fontFamily: fonts.heading,
            fontWeight: 800,
            color: numberColor,
          }}
        >
          <CountUpNumber
            target={number}
            startFrame={delay}
            duration={40}
            decimals={decimals}
            suffix={suffix}
            style={{ fontSize: fontSize["4xl"] }}
          />
        </div>
        <div
          style={{
            fontFamily: fonts.body,
            fontSize: fontSize.sm,
            color: colors.whiteAlpha75,
            textAlign: "center",
          }}
        >
          {label}
        </div>
      </div>
    </SpringFadeIn>
  );
};
