import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  spring,
  useVideoConfig,
} from "remotion";
import { colors, fonts, fontSize, springConfig } from "../design/tokens";
import { GradientBackground } from "../components/shared/GradientBackground";
import { ShieldLogo } from "../components/shared/ShieldLogo";
import { SpringFadeIn } from "../components/shared/SpringFadeIn";

export const Scene08CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({
    frame: frame - 10,
    fps,
    config: { damping: 8, mass: 0.5, stiffness: 150 },
  });

  return (
    <AbsoluteFill>
      <GradientBackground
        from="#0d1b2a"
        via="#17677b"
        to="#0d1b2a"
      />

      {/* Decorative elements */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "10%",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: `${colors.secondary}10`,
          filter: "blur(100px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "15%",
          right: "10%",
          width: 350,
          height: 350,
          borderRadius: "50%",
          background: `${colors.accent}10`,
          filter: "blur(80px)",
        }}
      />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 30,
        }}
      >
        {/* Logo */}
        <div style={{ transform: `scale(${logoScale})` }}>
          <ShieldLogo size={72} showText={false} />
        </div>

        {/* Product name */}
        <SpringFadeIn delay={15} direction="up">
          <div
            style={{
              fontFamily: fonts.heading,
              fontSize: fontSize["7xl"],
              fontWeight: 800,
              color: colors.white,
              textAlign: "center",
            }}
          >
            Cláusula Oculta
          </div>
        </SpringFadeIn>

        {/* Tagline */}
        <SpringFadeIn delay={25} direction="up">
          <div
            style={{
              fontFamily: fonts.body,
              fontSize: fontSize["2xl"],
              color: colors.whiteAlpha75,
              textAlign: "center",
              maxWidth: 700,
              lineHeight: 1.5,
            }}
          >
            Information is the best defense for consumers.
            <br />
            Let's democratize it.
          </div>
        </SpringFadeIn>

        {/* Divider */}
        <SpringFadeIn delay={40} direction="none">
          <div
            style={{
              width: 100,
              height: 2,
              background: `linear-gradient(90deg, transparent, ${colors.secondary}, transparent)`,
            }}
          />
        </SpringFadeIn>

        {/* Built with + By */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 40,
          }}
        >
          <SpringFadeIn delay={50} direction="up">
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontFamily: fonts.mono,
                  fontSize: fontSize.xs,
                  color: colors.whiteAlpha50,
                  textTransform: "uppercase",
                  letterSpacing: 2,
                  marginBottom: 8,
                }}
              >
                Built with
              </div>
              <div
                style={{
                  fontFamily: fonts.heading,
                  fontSize: fontSize["2xl"],
                  fontWeight: 700,
                  color: colors.accent,
                }}
              >
                Mistral AI
              </div>
            </div>
          </SpringFadeIn>

          <SpringFadeIn delay={55} direction="none">
            <div
              style={{
                width: 1,
                height: 40,
                background: colors.whiteAlpha20,
              }}
            />
          </SpringFadeIn>

          <SpringFadeIn delay={60} direction="up">
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontFamily: fonts.mono,
                  fontSize: fontSize.xs,
                  color: colors.whiteAlpha50,
                  textTransform: "uppercase",
                  letterSpacing: 2,
                  marginBottom: 8,
                }}
              >
                By
              </div>
              <div
                style={{
                  fontFamily: fonts.heading,
                  fontSize: fontSize["2xl"],
                  fontWeight: 700,
                  color: colors.secondary,
                }}
              >
                BBU Labs
              </div>
            </div>
          </SpringFadeIn>
        </div>

        {/* Competition badge */}
        <SpringFadeIn delay={75} direction="up">
          <div
            style={{
              padding: "10px 28px",
              borderRadius: 999,
              background: colors.whiteAlpha10,
              border: `1px solid ${colors.whiteAlpha20}`,
              fontFamily: fonts.mono,
              fontSize: fontSize.sm,
              color: colors.whiteAlpha75,
            }}
          >
            Mistral AI Hackathon 2026
          </div>
        </SpringFadeIn>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
