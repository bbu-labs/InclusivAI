import React from "react";
import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig } from "remotion";
import { colors, fonts, fontSize, springConfig } from "../design/tokens";
import { GradientBackground } from "../components/shared/GradientBackground";
import { SectionLabel } from "../components/shared/SectionLabel";
import { SpringFadeIn } from "../components/shared/SpringFadeIn";
import { CountUpNumber } from "../components/shared/CountUpNumber";

export const Scene01Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      <GradientBackground
        from="#0d1b2a"
        via="#132a3e"
        to="#0d1b2a"
      />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 120px",
          gap: 50,
        }}
      >
        <SectionLabel text="The Problem" delay={5} color={colors.error} />

        {/* Main stat */}
        <SpringFadeIn delay={15} direction="up">
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontFamily: fonts.heading,
                fontWeight: 800,
                color: colors.error,
                lineHeight: 1,
                marginBottom: 16,
              }}
            >
              <CountUpNumber
                target={95}
                startFrame={20}
                duration={35}
                suffix="%"
                style={{ fontSize: fontSize["8xl"] }}
              />
            </div>
            <div
              style={{
                fontFamily: fonts.heading,
                fontSize: fontSize["3xl"],
                fontWeight: 600,
                color: colors.white,
                maxWidth: 800,
              }}
            >
              of people never read the Terms of Service
            </div>
          </div>
        </SpringFadeIn>

        {/* Secondary stats row */}
        <div
          style={{
            display: "flex",
            gap: 80,
            marginTop: 20,
          }}
        >
          <SpringFadeIn delay={60} direction="up">
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontFamily: fonts.heading,
                  fontWeight: 800,
                  color: colors.secondary,
                  lineHeight: 1,
                  marginBottom: 8,
                }}
              >
                <CountUpNumber
                  target={2.8}
                  startFrame={65}
                  duration={30}
                  decimals={1}
                  suffix="M"
                  style={{ fontSize: fontSize["6xl"] }}
                />
              </div>
              <div
                style={{
                  fontFamily: fonts.body,
                  fontSize: fontSize.lg,
                  color: colors.whiteAlpha75,
                  maxWidth: 300,
                }}
              >
                digital scams reported in Brazil (2023)
              </div>
            </div>
          </SpringFadeIn>

          <SpringFadeIn delay={80} direction="up">
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontFamily: fonts.heading,
                  fontWeight: 800,
                  color: colors.secondary,
                  lineHeight: 1,
                  marginBottom: 8,
                }}
              >
                <span style={{ fontSize: fontSize["3xl"] }}>R$ </span>
                <CountUpNumber
                  target={2.5}
                  startFrame={85}
                  duration={30}
                  decimals={1}
                  suffix="Bi"
                  style={{ fontSize: fontSize["6xl"] }}
                />
              </div>
              <div
                style={{
                  fontFamily: fonts.body,
                  fontSize: fontSize.lg,
                  color: colors.whiteAlpha75,
                  maxWidth: 300,
                }}
              >
                in consumer losses
              </div>
            </div>
          </SpringFadeIn>
        </div>

        {/* Quote */}
        <SpringFadeIn delay={110} direction="up">
          <div
            style={{
              fontFamily: fonts.body,
              fontSize: fontSize.xl,
              color: colors.whiteAlpha50,
              fontStyle: "italic",
              textAlign: "center",
              maxWidth: 700,
              marginTop: 10,
            }}
          >
            "These contracts are designed to be unreadable.
            <br />
            And companies count on that."
          </div>
        </SpringFadeIn>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
