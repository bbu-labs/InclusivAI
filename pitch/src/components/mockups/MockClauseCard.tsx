import React from "react";
import { colors, fonts, fontSize } from "../../design/tokens";
import { SpringFadeIn } from "../shared/SpringFadeIn";

export const MockClauseCard: React.FC<{
  severity: "Alta" | "Média" | "Baixa";
  legalRef: string;
  explanation: string;
  delay?: number;
  scale?: number;
}> = ({ severity, legalRef, explanation, delay = 0, scale = 1 }) => {
  const badgeColor =
    severity === "Alta"
      ? colors.error
      : severity === "Média"
        ? colors.warning
        : colors.success;

  return (
    <SpringFadeIn delay={delay} direction="left">
      <div
        style={{
          background: colors.base200,
          borderRadius: 12 * scale,
          padding: `${12 * scale}px ${14 * scale}px`,
          width: "100%",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8 * scale,
            marginBottom: 6 * scale,
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              background: badgeColor,
              color: colors.white,
              fontFamily: fonts.body,
              fontSize: 10 * scale,
              fontWeight: 700,
              padding: `${2 * scale}px ${8 * scale}px`,
              borderRadius: 999,
              textTransform: "uppercase",
            }}
          >
            {severity}
          </span>
          <span
            style={{
              fontFamily: fonts.body,
              fontSize: 10 * scale,
              color: "rgba(31,41,55,0.5)",
            }}
          >
            {legalRef}
          </span>
        </div>
        {/* Explanation */}
        <p
          style={{
            fontFamily: fonts.body,
            fontSize: 11 * scale,
            color: "rgba(31,41,55,0.8)",
            lineHeight: 1.5,
            margin: 0,
          }}
        >
          {explanation}
        </p>
      </div>
    </SpringFadeIn>
  );
};
