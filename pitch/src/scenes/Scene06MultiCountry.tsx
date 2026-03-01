import React from "react";
import { AbsoluteFill } from "remotion";
import { colors, fonts, fontSize } from "../design/tokens";
import { GradientBackground } from "../components/shared/GradientBackground";
import { SectionLabel } from "../components/shared/SectionLabel";
import { SectionTitle } from "../components/shared/SectionTitle";
import { SpringFadeIn } from "../components/shared/SpringFadeIn";
import { MockPhone } from "../components/mockups/MockPhone";
import { MockNavbar } from "../components/mockups/MockNavbar";
import { FlagBadge } from "../components/shared/FlagBadge";
import { countryData } from "../data/demo-data";

const CountryPhone: React.FC<{
  country: (typeof countryData)[number];
  delay: number;
}> = ({ country, delay }) => {
  const sampleClause: Record<string, { law: string; text: string }> = {
    BR: {
      law: "Art. 51 CDC",
      text: "Cláusula abusiva: alteração unilateral do contrato sem aviso prévio.",
    },
    US: {
      law: "FTC Act §5",
      text: "Unfair clause: unilateral contract changes without prior notice.",
    },
    FR: {
      law: "Art. L212-1",
      text: "Clause abusive: modification unilatérale du contrat sans préavis.",
    },
  };

  const clause = sampleClause[country.code];

  return (
    <SpringFadeIn delay={delay} direction="up">
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <MockPhone scale={0.5}>
          <MockNavbar scale={0.5} />
          <div style={{ padding: "8px 8px" }}>
            {/* Flag + Country */}
            <div
              style={{
                textAlign: "center",
                marginBottom: 8,
              }}
            >
              <FlagBadge
                flag={country.flag}
                name={country.name}
                laws={country.laws}
                scale={0.5}
              />
            </div>

            {/* Sample flagged clause */}
            <div
              style={{
                background: colors.base200,
                borderRadius: 6,
                padding: "6px 8px",
                marginBottom: 6,
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: 4,
                  marginBottom: 3,
                }}
              >
                <span
                  style={{
                    background: colors.error,
                    color: colors.white,
                    fontSize: 5,
                    fontWeight: 700,
                    padding: "1px 4px",
                    borderRadius: 999,
                    fontFamily: fonts.body,
                  }}
                >
                  ALTA
                </span>
                <span
                  style={{
                    fontFamily: fonts.mono,
                    fontSize: 5,
                    color: colors.primary,
                  }}
                >
                  {clause.law}
                </span>
              </div>
              <p
                style={{
                  fontFamily: fonts.body,
                  fontSize: 5.5,
                  color: `${colors.baseContent}cc`,
                  lineHeight: 1.4,
                  margin: 0,
                }}
              >
                {clause.text}
              </p>
            </div>
          </div>
        </MockPhone>
      </div>
    </SpringFadeIn>
  );
};

export const Scene06MultiCountry: React.FC = () => {
  return (
    <AbsoluteFill>
      <GradientBackground from="#0d1b2a" via="#132a3e" to="#0d1b2a" />

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
          <SectionLabel text="Global Coverage" delay={5} />
          <div style={{ marginTop: 12 }}>
            <SectionTitle
              text="Three countries, localized legal frameworks"
              delay={12}
              size={fontSize["3xl"]}
              maxWidth={800}
            />
          </div>
        </div>

        {/* Three phones */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 50,
          }}
        >
          {countryData.map((country, i) => (
            <CountryPhone
              key={country.code}
              country={country}
              delay={20 + i * 15}
            />
          ))}
        </div>

        {/* Bottom text */}
        <SpringFadeIn delay={70} direction="up">
          <div
            style={{
              fontFamily: fonts.body,
              fontSize: fontSize.lg,
              color: colors.whiteAlpha75,
              textAlign: "center",
              maxWidth: 700,
            }}
          >
            Each analysis cites the exact laws for the user's jurisdiction.
          </div>
        </SpringFadeIn>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
