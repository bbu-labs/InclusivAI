import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  spring,
  useVideoConfig,
  interpolate,
} from "remotion";
import { colors, fonts, fontSize, springConfig } from "../design/tokens";
import { GradientBackground } from "../components/shared/GradientBackground";
import { ShieldLogo } from "../components/shared/ShieldLogo";
import { SpringFadeIn } from "../components/shared/SpringFadeIn";
import { SectionLabel } from "../components/shared/SectionLabel";
import { MockScoreGauge } from "../components/mockups/MockScoreGauge";

export const Scene03Solution: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({
    frame: frame - 10,
    fps,
    config: { damping: 10, mass: 0.6, stiffness: 120 },
  });

  return (
    <AbsoluteFill>
      <GradientBackground
        from="#0d1b2a"
        via="#17677b"
        to="#0d1b2a"
      />

      {/* Decorative blur circles */}
      <div
        style={{
          position: "absolute",
          top: -100,
          right: -50,
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: `${colors.secondary}15`,
          filter: "blur(80px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -80,
          left: -80,
          width: 350,
          height: 350,
          borderRadius: "50%",
          background: `${colors.primary}20`,
          filter: "blur(60px)",
        }}
      />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 120px",
          gap: 100,
        }}
      >
        {/* Left: Text content */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          <SectionLabel text="The Solution" delay={5} />

          <div style={{ transform: `scale(${logoScale})` }}>
            <ShieldLogo size={56} />
          </div>

          <SpringFadeIn delay={20} direction="up">
            <div
              style={{
                fontFamily: fonts.heading,
                fontSize: fontSize["4xl"],
                fontWeight: 800,
                color: colors.white,
                lineHeight: 1.2,
              }}
            >
              Cláusula Oculta
            </div>
          </SpringFadeIn>

          <SpringFadeIn delay={30} direction="up">
            <div
              style={{
                fontFamily: fonts.body,
                fontSize: fontSize.xl,
                color: colors.whiteAlpha75,
                lineHeight: 1.6,
                maxWidth: 550,
              }}
            >
              An AI assistant that analyzes Terms of Service, contracts, and
              suspicious messages — translating legalese into plain language and
              mapping violations against consumer protection law.
            </div>
          </SpringFadeIn>

          <SpringFadeIn delay={50} direction="up">
            <div
              style={{
                display: "flex",
                gap: 16,
                marginTop: 8,
              }}
            >
              {["ToS Analysis", "Scam Detection", "Contract Review"].map(
                (label, i) => (
                  <div
                    key={label}
                    style={{
                      padding: "8px 20px",
                      borderRadius: 999,
                      background: colors.whiteAlpha10,
                      border: `1px solid ${colors.whiteAlpha20}`,
                      fontFamily: fonts.mono,
                      fontSize: fontSize.sm,
                      color: colors.accent,
                    }}
                  >
                    {label}
                  </div>
                )
              )}
            </div>
          </SpringFadeIn>
        </div>

        {/* Right: Score preview */}
        <SpringFadeIn delay={40} direction="right" distance={50}>
          <div
            style={{
              background: colors.white,
              borderRadius: 24,
              padding: 40,
              boxShadow: "0 30px 60px rgba(0,0,0,0.3)",
            }}
          >
            <MockScoreGauge score={32} startFrame={50} duration={50} size={180} />
          </div>
        </SpringFadeIn>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
