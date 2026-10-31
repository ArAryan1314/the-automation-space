"use client";

import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  Send,
  ChevronDown,
} from "lucide-react";
import {
  Section,
  PageHero,
  Badge,
  Card,
  CardTitle,
  CardDescription,
  Button,
  Input,
  Textarea,
  Label,
  IconBox,
} from "@/components/ui";
import { callApi } from "@/lib/api";

const offices = [
  {
    name: "San Francisco (Global HQ)",
    address: "555 California St, Suite 4800, San Francisco, CA 94104",
  },
  {
    name: "New York City (FinTech Practice)",
    address: "One Vanderbilt Ave, 38th Floor, New York, NY 10017",
  },
  {
    name: "London (EMEA Operations)",
    address: "100 Bishopsgate, Level 24, London EC2N 4AG, UK",
  },
];

export function ContactView() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Executive Retained Inquiry",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await callApi("/api/contacts", formData);
      setFormData({ ...formData, message: "" });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* SECTION 1: Page Header */}
      <PageHero
        badge={
          <Badge variant="default" className="py-1 px-3.5">
            <Mail className="h-3.5 w-3.5" />
            <span>Executive Search Consultation</span>
          </Badge>
        }
        title="Connect with Our Sector Practice Heads"
        description="Whether you need to scale a 20-person engineering team or seek confidential career representation, our partners are ready to assist."
      />

      {/* SECTION 2: Split Contact Grid */}
      <Section variant="muted">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Left Column: Office Details */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="p-6 sm:p-8 space-y-6 hover:shadow-soft hover:border-border">
              <CardTitle className="text-xl">Global Practice Locations</CardTitle>

              <div className="space-y-3">
                {offices.map((office) => (
                  <div
                    key={office.name}
                    className="flex items-start gap-4 rounded-xl border border-border bg-surface p-4"
                  >
                    <IconBox size="sm">
                      <MapPin />
                    </IconBox>
                    <div>
                      <h3 className="text-sm font-bold text-foreground">{office.name}</h3>
                      <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">{office.address}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-5 border-t border-border space-y-3 text-sm text-body">
                <div className="flex items-center gap-3">
                  <IconBox size="sm" tone="neutral">
                    <Phone />
                  </IconBox>
                  <span>Direct Advisory Desk: +1 (415) 890-2739</span>
                </div>
                <div className="flex items-center gap-3">
                  <IconBox size="sm" tone="neutral">
                    <Mail />
                  </IconBox>
                  <span className="break-all">Inquiries: advisory@the-automation-space.com</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <Card className="p-6 sm:p-8 hover:shadow-soft hover:border-border">
              <CardTitle className="text-xl mb-1">Direct Partner Briefing Form</CardTitle>
              <CardDescription className="mb-6">
                Inquiries are prioritized and immediately forwarded to dedicated sector practice leads for confidential review.
              </CardDescription>

              {submitted ? (
                <div className="p-6 rounded-xl bg-primary-soft border border-primary-muted text-body text-sm space-y-2 animate-fade-up">
                  <div className="flex items-center gap-2 font-bold text-base text-primary-hover">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span>Briefing Request Submitted</span>
                  </div>
                  <p className="leading-relaxed">
                    Thank you for contacting The Automation Studio. A technical recruitment practice lead will review your message and reply within 24 business hours.
                  </p>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setSubmitted(false)}
                    className="mt-3"
                  >
                    Send another inquiry
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <Label htmlFor="contact-name">Your name</Label>
                      <Input
                        id="contact-name"
                        type="text"
                        required
                        placeholder="e.g. John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact-email">Email address</Label>
                      <Input
                        id="contact-email"
                        type="email"
                        required
                        placeholder="john@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <Label htmlFor="contact-phone">Phone number (optional)</Label>
                      <Input
                        id="contact-phone"
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact-subject">Inquiry type</Label>
                      <div className="relative">
                        <select
                          id="contact-subject"
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          className="h-11 w-full appearance-none rounded-xl border border-input bg-surface pl-3.5 pr-10 text-sm text-foreground shadow-sm transition-all cursor-pointer focus-visible:outline-none focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10"
                        >
                          <option>Executive Retained Inquiry</option>
                          <option>Corporate Engineering Sourcing</option>
                          <option>Candidate Representation</option>
                          <option>Press & General Partnership</option>
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="contact-message">Your requirements & goals</Label>
                    <Textarea
                      id="contact-message"
                      rows={5}
                      required
                      minLength={10}
                      placeholder="Tell us about the headcount you are looking to hire, or your executive background..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>

                  {error && <p role="alert" className="text-sm text-red-300">{error}</p>}

                  <Button
                    type="submit"
                    disabled={loading}
                    size="lg"
                    className="w-full"
                  >
                    {loading ? (
                      <span>Routing to Sector Practice Lead...</span>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>Transmit Briefing Request</span>
                      </>
                    )}
                  </Button>
                </form>
              )}
            </Card>
          </div>
        </div>
      </Section>
    </div>
  );
}
