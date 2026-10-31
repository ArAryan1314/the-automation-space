"use client";

import { useState } from "react";
import {
  DollarSign,
  TrendingUp,
  Clock,
  MapPin,
} from "lucide-react";
import {
  Section,
  SectionHeader,
  PageHero,
  Badge,
  Card,
  CardTitle,
  CardDescription,
  TabsList,
  TabsTrigger,
  IconBox,
} from "@/components/ui";

export function SalaryGuideView() {
  const [selectedRole, setSelectedRole] = useState("AI & Machine Learning");

  const compensationData: Record<string, Array<{ role: string; mid: string; senior: string; staff: string; vp: string }>> = {
    "AI & Machine Learning": [
      { role: "Large Language Model Engineer", mid: "$170k - $210k", senior: "$210k - $265k", staff: "$270k - $360k", vp: "$380k - $520k" },
      { role: "Computer Vision / Multimodal", mid: "$160k - $195k", senior: "$200k - $250k", staff: "$260k - $340k", vp: "$360k - $480k" },
      { role: "MLOps & Inference Cluster Architect", mid: "$165k - $205k", senior: "$205k - $260k", staff: "$265k - $350k", vp: "$350k - $470k" },
    ],
    "Core Engineering": [
      { role: "Distributed Systems (Rust / Go)", mid: "$150k - $190k", senior: "$190k - $240k", staff: "$250k - $320k", vp: "$340k - $460k" },
      { role: "Backend Infrastructure", mid: "$145k - $185k", senior: "$185k - $230k", staff: "$240k - $300k", vp: "$320k - $430k" },
      { role: "Staff Frontend Architect", mid: "$140k - $180k", senior: "$180k - $225k", staff: "$230k - $290k", vp: "$310k - $400k" },
    ],
    "Security & Infrastructure": [
      { role: "Cloud Security / Zero-Trust", mid: "$155k - $195k", senior: "$195k - $250k", staff: "$255k - $330k", vp: "$350k - $475k" },
      { role: "Site Reliability (SRE / Platform)", mid: "$150k - $185k", senior: "$185k - $235k", staff: "$240k - $310k", vp: "$330k - $440k" },
    ],
    "Executive Leadership": [
      { role: "Chief Technology Officer (CTO)", mid: "N/A", senior: "N/A", staff: "N/A", vp: "$380k - $550k + 2-5% Eq" },
      { role: "VP of Engineering", mid: "N/A", senior: "N/A", staff: "N/A", vp: "$340k - $480k + 1-3% Eq" },
      { role: "Chief Product Officer (CPO)", mid: "N/A", senior: "N/A", staff: "N/A", vp: "$350k - $500k + 1.5-3.5% Eq" },
    ],
  };

  const salaryCell = (value: string, emphasis = false) =>
    value === "N/A" ? (
      <span className="text-subtle-foreground">N/A</span>
    ) : (
      <span className={emphasis ? "text-primary-hover font-bold" : "text-foreground font-semibold"}>{value}</span>
    );

  return (
    <div>
      {/* SECTION 1: Page Header */}
      <PageHero
        badge={
          <Badge variant="default" className="py-1 px-3.5">
            <DollarSign className="h-3.5 w-3.5" />
            <span>2026 Executive & Tech Compensation Benchmarks</span>
          </Badge>
        }
        title="Comprehensive Tech Salary & Equity Guide"
        description="Aggregated from 1,200+ verified technology placements, offer letters, and venture capital hiring surveys across San Francisco, NYC, Austin, and Remote Hubs."
      />

      {/* SECTION 2: Role Selector Tabs */}
      <Section variant="muted">
        <div className="flex justify-center mb-8">
          <TabsList>
            {Object.keys(compensationData).map((cat) => (
              <TabsTrigger
                key={cat}
                active={selectedRole === cat}
                onClick={() => setSelectedRole(cat)}
              >
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Compensation Table */}
        <Card className="p-0 overflow-hidden hover:shadow-soft hover:border-border">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-surface border-b border-border">
                <tr className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <th scope="col" className="py-3.5 px-6">Specialization</th>
                  <th scope="col" className="py-3.5 px-6 whitespace-nowrap">Mid-Level (3-5 Yrs)</th>
                  <th scope="col" className="py-3.5 px-6 whitespace-nowrap">Senior (6-8 Yrs)</th>
                  <th scope="col" className="py-3.5 px-6 whitespace-nowrap">Staff / Principal (9+ Yrs)</th>
                  <th scope="col" className="py-3.5 px-6 whitespace-nowrap text-primary-hover">VP / Head of Department</th>
                </tr>
              </thead>
              <tbody key={selectedRole} className="divide-y divide-border text-body animate-fade-up">
                {compensationData[selectedRole].map((row, i) => (
                  <tr key={i} className="hover:bg-surface/60 transition-colors">
                    <th scope="row" className="py-4 px-6 font-semibold text-foreground">
                      {row.role}
                    </th>
                    <td className="py-4 px-6 whitespace-nowrap tabular-nums">{salaryCell(row.mid)}</td>
                    <td className="py-4 px-6 whitespace-nowrap tabular-nums">{salaryCell(row.senior)}</td>
                    <td className="py-4 px-6 whitespace-nowrap tabular-nums">{salaryCell(row.staff)}</td>
                    <td className="py-4 px-6 whitespace-nowrap tabular-nums bg-primary-soft/50">{salaryCell(row.vp, true)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        <p className="mt-4 text-xs text-subtle-foreground text-center">
          Scroll horizontally on smaller screens to view all seniority bands.
        </p>
      </Section>

      {/* SECTION 3: 2026 Compensation Macro Trends */}
      <Section>
        <SectionHeader title="Key Insights Shaping 2026 Compensation" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 space-y-3">
            <IconBox>
              <TrendingUp />
            </IconBox>
            <CardTitle className="text-base">AI Premium Surges 25%</CardTitle>
            <CardDescription>
              Engineers with verified hands-on PyTorch, distributed inference, and LLM fine-tuning experience command 20-30% premiums over generalist full-stack roles.
            </CardDescription>
          </Card>
          <Card className="p-6 space-y-3">
            <IconBox tone="accent">
              <Clock />
            </IconBox>
            <CardTitle className="text-base">Liquidity & Accelerated Vesting</CardTitle>
            <CardDescription>
              Executive candidates increasingly negotiate for accelerated vesting upon single-trigger change of control and secondary share sale participation clauses.
            </CardDescription>
          </Card>
          <Card className="p-6 space-y-3">
            <IconBox tone="sky">
              <MapPin />
            </IconBox>
            <CardTitle className="text-base">Hybrid Anchor Locations</CardTitle>
            <CardDescription>
              While remote options persist, Tier 1 tech hubs (SF Bay Area, New York) retain a 15-20% compensation premium for key technical leadership roles.
            </CardDescription>
          </Card>
        </div>
      </Section>
    </div>
  );
}
