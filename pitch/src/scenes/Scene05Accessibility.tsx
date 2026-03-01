import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
} from "remotion";
import { colors, fonts, fontSize, springConfig } from "../design/tokens";
import { GradientBackground } from "../components/shared/GradientBackground";
import { SectionLabel } from "../components/shared/SectionLabel";
import { SectionTitle } from "../components/shared/SectionTitle";
import { SpringFadeIn } from "../components/shared/SpringFadeIn";
import { MockPhone } from "../components/mockups/MockPhone";
import { MockNavbar } from "../components/mockups/MockNavbar";
import { MockScoreGauge } from "../components/mockups/MockScoreGauge";
import { MockAudioPlayer } from "../components/mockups/MockAudioPlayer";

const PhoneContent: React.FC<{
  mode: "standard" | "senior";
  frame: number;
}> = ({ mode, frame }) => {
  const isSenior = mode === "senior";
  const baseFontSize = isSenior ? 22 : 17;
  const headingSize = isSenior ? 30 : 26;
  const btnHeight = isSenior ? 56 : 44;
  const cardPadding = isSenior ? 28 : 20;
  const scale = 0.7;

  const morphProgress = interpolate(frame, [30, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const currentFontSize = isSenior
    ? 17 + (22 - 17) * morphProgress
    : baseFontSize;
  const currentHeadingSize = isSenior
    ? 26 + (30 - 26) * morphProgress
    : headingSize;
  const currentBtnHeight = isSenior
    ? 44 + (56 - 44) * morphProgress
    : btnHeight;

  return (
    <div>
      <MockNavbar scale={scale} />
      <div style={{ padding: `${12 * scale}px` }}>
        {/* Guidance alert for senior */}
        {isSenior && (
          <div
            style={{
              opacity: interpolate(frame, [45, 60], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
              background: "#3abff814",
              border: "1px solid #3abff833",
              borderRadius: 8 * scale,
              padding: `${8 * scale}px ${10 * scale}px`,
              marginBottom: 10 * scale,
              display: "flex",
              alignItems: "center",
              gap: 6 * scale,
            }}
          >
            <svg width={14 * scale} height={14 * scale} viewBox="0 0 24 24" fill="#3abff8">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
            </svg>
            <span
              style={{
                fontFamily: fonts.body,
                fontSize: 9 * scale,
                color: "#3abff8",
              }}
            >
              Toque no botão para analisar seu documento
            </span>
          </div>
        )}

        {/* Title */}
        <div
          style={{
            fontFamily: fonts.heading,
            fontSize: currentHeadingSize * scale * 0.6,
            fontWeight: 700,
            color: colors.baseContent,
            textAlign: "center",
            marginBottom: 10 * scale,
          }}
        >
          Resultado da Análise
        </div>

        {/* Score */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 10 * scale,
          }}
        >
          <MockScoreGauge score={32} startFrame={20} duration={30} size={70 * scale} />
        </div>

        {/* Sample clause card */}
        <div
          style={{
            background: colors.base200,
            borderRadius: 8 * scale,
            padding: `${cardPadding * scale * 0.5}px`,
            marginBottom: 8 * scale,
          }}
        >
          <div style={{ display: "flex", gap: 4 * scale, marginBottom: 4 * scale }}>
            <span
              style={{
                background: colors.error,
                color: colors.white,
                fontSize: 7 * scale,
                fontWeight: 700,
                padding: `${1 * scale}px ${5 * scale}px`,
                borderRadius: 999,
                fontFamily: fonts.body,
              }}
            >
              ALTA
            </span>
            <span
              style={{
                fontFamily: fonts.body,
                fontSize: 7 * scale,
                color: `${colors.baseContent}80`,
              }}
            >
              Art. 51 CDC
            </span>
          </div>
          <p
            style={{
              fontFamily: fonts.body,
              fontSize: currentFontSize * scale * 0.5,
              color: `${colors.baseContent}cc`,
              lineHeight: isSenior ? 1.8 : 1.5,
              margin: 0,
            }}
          >
            Cláusula permite alteração unilateral dos termos sem aviso prévio.
          </p>
        </div>

        {/* Audio player — prominent in senior */}
        {isSenior && (
          <div style={{ marginBottom: 8 * scale }}>
            <MockAudioPlayer startFrame={50} scale={scale} />
          </div>
        )}

        {/* Button */}
        <div
          style={{
            background: colors.primary,
            color: colors.white,
            fontFamily: fonts.body,
            fontSize: currentFontSize * scale * 0.55,
            fontWeight: 700,
            textAlign: "center",
            padding: `${currentBtnHeight * scale * 0.3}px 0`,
            borderRadius: 8 * scale,
          }}
        >
          Analisar Outro
        </div>
      </div>
    </div>
  );
};

export const Scene05Accessibility: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill>
      <GradientBackground from="#0d1b2a" via="#1b2838" to="#0d1b2a" />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 30,
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center" }}>
          <SectionLabel text="Accessibility" delay={5} />
          <div style={{ marginTop: 12 }}>
            <SectionTitle
              text="Adapts to every user"
              delay={12}
              size={fontSize["4xl"]}
            />
          </div>
        </div>

        {/* Side by side phones */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 60,
          }}
        >
          {/* Standard mode */}
          <SpringFadeIn delay={20} direction="left" distance={40}>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontFamily: fonts.mono,
                  fontSize: fontSize.sm,
                  color: colors.whiteAlpha50,
                  marginBottom: 12,
                  textTransform: "uppercase",
                  letterSpacing: 2,
                }}
              >
                Standard Mode
              </div>
              <MockPhone scale={0.65}>
                <PhoneContent mode="standard" frame={frame} />
              </MockPhone>
            </div>
          </SpringFadeIn>

          {/* Divider arrow */}
          <SpringFadeIn delay={40} direction="none">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
                marginTop: 120,
              }}
            >
              <svg
                width={48}
                height={48}
                viewBox="0 0 24 24"
                fill="none"
                stroke={colors.secondary}
                strokeWidth={2}
                strokeLinecap="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
              <span
                style={{
                  fontFamily: fonts.mono,
                  fontSize: fontSize.xs,
                  color: colors.secondary,
                }}
              >
                ADAPTS
              </span>
            </div>
          </SpringFadeIn>

          {/* Senior mode */}
          <SpringFadeIn delay={30} direction="right" distance={40}>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontFamily: fonts.mono,
                  fontSize: fontSize.sm,
                  color: colors.secondary,
                  marginBottom: 12,
                  textTransform: "uppercase",
                  letterSpacing: 2,
                }}
              >
                Senior Mode
              </div>
              <div style={{ position: "relative" }}>
                <MockPhone scale={0.65}>
                  <PhoneContent mode="senior" frame={frame} />
                </MockPhone>
                {/* Golden glow */}
                <div
                  style={{
                    position: "absolute",
                    inset: -8,
                    borderRadius: 52,
                    border: `2px solid ${colors.secondary}40`,
                    boxShadow: `0 0 40px ${colors.secondary}20`,
                    pointerEvents: "none",
                  }}
                />
              </div>
            </div>
          </SpringFadeIn>
        </div>

        {/* Features row */}
        <div
          style={{
            display: "flex",
            gap: 20,
            marginTop: 8,
          }}
        >
          {[
            "Larger fonts (22px)",
            "Simplified navigation",
            "Audio-first output",
            "Guided tips",
          ].map((feature, i) => (
            <SpringFadeIn key={feature} delay={70 + i * 8} direction="up">
              <div
                style={{
                  padding: "8px 18px",
                  borderRadius: 999,
                  background: `${colors.secondary}15`,
                  border: `1px solid ${colors.secondary}30`,
                  fontFamily: fonts.body,
                  fontSize: fontSize.sm,
                  color: colors.secondary,
                }}
              >
                {feature}
              </div>
            </SpringFadeIn>
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
