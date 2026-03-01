import React from "react";
import { AbsoluteFill } from "remotion";
import { colors, fonts, fontSize } from "../design/tokens";
import { GradientBackground } from "../components/shared/GradientBackground";
import { SectionLabel } from "../components/shared/SectionLabel";
import { SectionTitle } from "../components/shared/SectionTitle";
import { StatCard } from "../components/shared/StatCard";
import { SpringFadeIn } from "../components/shared/SpringFadeIn";

export const Scene02Scale: React.FC = () => {
  return (
    <AbsoluteFill>
      <GradientBackground
        from="#0d1b2a"
        via="#1b2838"
        to="#0d1b2a"
      />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 100px",
          gap: 40,
        }}
      >
        <SectionLabel text="Market Opportunity" delay={5} />

        <SectionTitle
          text="A massive untapped market"
          delay={12}
          size={fontSize["4xl"]}
        />

        {/* Stats row */}
        <div
          style={{
            display: "flex",
            gap: 32,
            marginTop: 10,
          }}
        >
          <StatCard
            icon={
              <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" strokeLinecap="round" />
              </svg>
            }
            number={156}
            suffix="M+"
            label="Internet users in Brazil"
            delay={20}
          />

          <StatCard
            icon={
              <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" />
              </svg>
            }
            number={0}
            label="Consumer legal AI products in Portuguese"
            delay={35}
            numberColor={colors.error}
          />

          <StatCard
            icon={
              <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
            number={576}
            suffix="%"
            label="Growth in digital rights searches"
            delay={50}
            numberColor={colors.success}
          />
        </div>

        {/* Bottom tagline */}
        <SpringFadeIn delay={75} direction="up">
          <div
            style={{
              fontFamily: fonts.body,
              fontSize: fontSize.xl,
              color: colors.whiteAlpha75,
              textAlign: "center",
              marginTop: 10,
            }}
          >
            The opportunity is massive, and the timing is now.
          </div>
        </SpringFadeIn>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
