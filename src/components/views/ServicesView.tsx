import Link from "next/link";
import {
  Zap,
  CheckCircle2,
  ArrowRight,
  Clock,
  Lock,
  ShieldCheck,
} from "lucide-react";
import {
  Section,
  SectionHeader,
  PageHero,
  Badge,
  Card,
  CardTitle,
  CardDescription,
  Button,
  IconBox,
} from "@/components/ui";
import { AUTOMATION_STUDIO_SERVICES } from "@/data/automationData";

export function ServicesView() {
  const slas = [
    {
      code: "SLA 01",
      icon: <Clock />,
      title: "Rapid Turnaround",
      desc: "All inbound candidate and client search inquiries are routed to senior practice directors within 2 hours.",
    },
    {
      code: "SLA 02",
      icon: <Lock />,
      title: "Confidential Guarantee",
      desc: "Zero-blind resume submissions and strict NDA protection for passive candidates and stealth searches.",
    },
    {
      code: "SLA 03",
      icon: <ShieldCheck />,
      title: "90-Day Retention Warranty",
      desc: "Every executive search and technical placement engagement is backed by an unconditional replacement warranty.",
    },
  ];

  return (
    <div className="animate-fade-up">
      {/* SECTION 1: Page Header */}
      <PageHero
        badge={
          <Badge variant="default" className="py-1 px-3.5">
            <Zap className="h-3.5 w-3.5" />
            <span>The Automation Studio Practice Areas</span>
          </Badge>
        }
        title="Technical & Executive Recruitment Practices"
        description="From executive machine learning leadership to high-throughput distributed systems and embedded talent squads, our practices deliver pre-calibrated engineering talent."
      />

      {/* SECTION 2: Solution Offerings Grid */}
      <Section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {AUTOMATION_STUDIO_SERVICES.map((srv) => (
            <Card key={srv.id} className="p-8 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <IconBox size="lg">
                    <Zap />
                  </IconBox>
                  <Badge variant="secondary">{srv.category}</Badge>
                </div>

                <div>
                  <CardTitle className="text-2xl mb-1">{srv.title}</CardTitle>
                  <p className="text-sm text-primary font-semibold">{srv.metrics}</p>
                </div>

                <CardDescription>
                  {srv.description}
                </CardDescription>

                <div className="rounded-xl bg-surface border border-border p-4 space-y-2.5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Core Architectural Deliverables:
                  </p>
                  {srv.deliverables.map((del, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-body">
                      <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                      <span>{del}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-border flex flex-wrap items-center justify-between gap-2">
                <Link href="/contact">
                  <Button variant="default" size="sm">
                    <span>Engage Practice</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
                <Link href="/employers">
                  <Button variant="ghost" size="sm">
                    View Requisition Options
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* SECTION 3: Service SLA Commitments */}
      <Section variant="muted">
        <SectionHeader
          badge={<Badge variant="outline">Contractual Commitments</Badge>}
          title="Our Operational SLA Standards"
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {slas.map((sla) => (
            <Card key={sla.code} className="p-6 space-y-3">
              <div className="flex items-center justify-between">
                <IconBox>{sla.icon}</IconBox>
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                  {sla.code}
                </span>
              </div>
              <CardTitle className="text-base">{sla.title}</CardTitle>
              <CardDescription>{sla.desc}</CardDescription>
            </Card>
          ))}
        </div>
      </Section>
    </div>
  );
}
