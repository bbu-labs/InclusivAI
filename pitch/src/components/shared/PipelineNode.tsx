import React from "react";
import { colors, fonts, fontSize } from "../../design/tokens";
import { SpringFadeIn } from "./SpringFadeIn";

export const PipelineNode: React.FC<{
  name: string;
  description: string;
  delay?: number;
  isActive?: boolean;
}> = ({ name, description, delay = 0, isActive = false }) => {
  return (
    <SpringFadeIn delay={delay} direction="up">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div
          style={{
            width: 100,
            height: 100,
            borderRadius: 20,
            background: isActive
              ? `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`
              : colors.bgCard,
            border: `2px solid ${isActive ? colors.accent : colors.whiteAlpha20}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: isActive
              ? `0 0 30px ${colors.accent}40`
              : "0 4px 20px rgba(0,0,0,0.3)",
          }}
        >
          <svg
            width={40}
            height={40}
            viewBox="0 0 24 24"
            fill="none"
            stroke={isActive ? colors.white : colors.accent}
            strokeWidth={1.5}
            strokeLinecap="round"
          >
            <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontFamily: fonts.heading,
              fontSize: fontSize.base,
              fontWeight: 700,
              color: colors.white,
              marginBottom: 2,
            }}
          >
            {name}
          </div>
          <div
            style={{
              fontFamily: fonts.body,
              fontSize: fontSize.xs,
              color: colors.whiteAlpha50,
            }}
          >
            {description}
          </div>
        </div>
      </div>
    </SpringFadeIn>
  );
};
