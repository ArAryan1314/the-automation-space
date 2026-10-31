"use client";

import Link from "next/link";
import {
  Mail,
  Zap,
} from "lucide-react";
import {
  Section,
  PageHero,
  Heading,
  Text,
  Badge,
  Button,
  Accordion,
  IconBox,
} from "@/components/ui";
import { AUTOMATION_STUDIO_FAQS } from "@/data/automationData";

export function FAQView() {
  const accordionItems = AUTOMATION_STUDIO_FAQS.map((faq, idx) => ({
    id: idx,
    trigger: faq.q,
    content: faq.a,
  }));

  return (
    <div>
      {/* SECTION 1: Page Header */}
      <PageHero
        badge={
          <Badge variant="default" className="py-1 px-3.5">
            <Zap className="h-3.5 w-3.5" />
            <span>The Automation Studio Knowledge Center</span>
          </Badge>
        }
        title="Frequently Asked Questions"
        description="Detailed guidance regarding our recruitment practice vetting process, candidate confidential representation, salary benchmark indices, and enterprise engagement terms."
      />

      {/* SECTION 2: Accordion FAQ List using Accordion Component */}
      <Section variant="muted">
        <div className="max-w-3xl mx-auto">
          <Accordion items={accordionItems} />
        </div>
      </Section>

      {/* SECTION 3: Help Desk CTA */}
      <Section variant="glow" className="text-center">
        <div className="max-w-2xl mx-auto space-y-4 flex flex-col items-center">
          <IconBox size="lg" className="bg-card">
            <Mail />
          </IconBox>
          <Heading as="h2" size="h2">Need confidential recruitment guidance?</Heading>
          <Text size="base" variant="muted" className="max-w-md mx-auto">
            Our practice managing partners are available for direct talent consultations and confidential search briefings.
          </Text>
          <Link href="/contact">
            <Button size="lg" className="mt-2">
              <Mail className="h-4 w-4" />
              <span>Contact Talent Practice</span>
            </Button>
          </Link>
        </div>
      </Section>
    </div>
  );
}
