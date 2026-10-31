import Link from "next/link";
import {
  Users,
  Mail,
  Globe2,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import {
  Section,
  PageHero,
  Heading,
  Text,
  Badge,
  Card,
  CardTitle,
  CardDescription,
  IconBox,
} from "@/components/ui";
import { SPECIALISTS } from "@/data/agencyData";

function getInitials(name: string) {
  return name
    .replace(/^Dr\.\s+/, "")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function TeamView() {
  return (
    <div className="animate-fade-up">
      {/* SECTION 1: Page Header */}
      <PageHero
        badge={
          <Badge variant="default" className="py-1 px-3.5">
            <Users className="h-4 w-4" />
            <span>Sector Practice Leadership</span>
          </Badge>
        }
        title="Meet Our Executive Talent Partners"
        description="Our team comprises former technology founders, executive advisors, and deep-tech practitioners dedicated to high-touch candidate advocacy and corporate precision search."
      />

      {/* SECTION 2: Specialists Grid */}
      <Section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SPECIALISTS.map((spec, idx) => (
            <Card
              key={idx}
              className="p-6 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-5">
                  <div
                    className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground text-xl font-bold flex items-center justify-center shadow-soft ring-4 ring-primary-soft group-hover:scale-105 transition-transform duration-300"
                    aria-label={spec.name}
                  >
                    {getInitials(spec.name)}
                  </div>
                  <Badge variant="default">{spec.placements}+ Placements</Badge>
                </div>

                <CardTitle className="text-base">{spec.name}</CardTitle>
                <p className="text-sm text-primary font-semibold mt-0.5">{spec.role}</p>
                <p className="text-xs text-subtle-foreground mt-1">{spec.specialization}</p>

                <CardDescription className="mt-3">
                  {spec.bio}
                </CardDescription>
              </div>

              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-sm">
                <Link
                  href="/contact"
                  className="font-semibold text-primary hover:text-primary-hover flex items-center gap-1"
                >
                  <span>Book Briefing</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <div className="flex items-center gap-2 text-subtle-foreground">
                  <Globe2 className="h-4 w-4 hover:text-primary cursor-pointer transition-colors" />
                  <Mail className="h-4 w-4 hover:text-primary cursor-pointer transition-colors" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* SECTION 3: The Partner Difference */}
      <Section variant="glow">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <IconBox size="lg" className="mx-auto">
            <ShieldCheck />
          </IconBox>
          <Heading as="h2" size="h2">Direct Partner Execution — Never Delegated to Junior Staff</Heading>
          <Text size="base" variant="muted" className="max-w-2xl mx-auto">
            At conventional mega-agencies, senior partners pitch the business and immediately hand execution to recent college graduates. At The Automation Studio, the partner you sign with conducts every interview, screen, and candidate negotiation personally.
          </Text>
        </div>
      </Section>
    </div>
  );
}
