"use client";

import { useState } from "react";
import { Clock, Contact, FileText, Mail, Phone, Plus, Trash2 } from "lucide-react";
import { Badge, Button, Card, CardTitle, IconBox, Input, Label, Modal, Textarea } from "@/components/ui";
import type { ContactRecord } from "@/lib/records";
import { ApiError, callApi, formatDateTime } from "./adminApi";

interface ContactsPanelProps {
  contacts: ContactRecord[];
  onChanged: () => void;
  onSessionExpired: () => void;
}

const emptyForm = { name: "", email: "", phone: "", subject: "", message: "" };

export function ContactsPanel({ contacts, onChanged, onSessionExpired }: ContactsPanelProps) {
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const update = (field: keyof typeof emptyForm, value: string) => setForm({ ...form, [field]: value });

  const handleFailure = (err: unknown) => {
    if (err instanceof ApiError && err.status === 401) onSessionExpired();
    else setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await callApi("/api/contacts", { ...form, action: "create" });
      setForm(emptyForm);
      setFormOpen(false);
      onChanged();
    } catch (err) {
      handleFailure(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (contact: ContactRecord) => {
    if (!window.confirm(`Delete the contact record for ${contact.name}? This cannot be undone.`)) return;
    setError("");
    try {
      await callApi("/api/contacts", { action: "delete", id: contact.id });
      onChanged();
    } catch (err) {
      handleFailure(err);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Messages from the contact form, plus any contacts you add yourself.
        </p>
        <Button
          size="sm"
          onClick={() => {
            setError("");
            setFormOpen(true);
          }}
        >
          <Plus className="h-4 w-4" />
          <span>Add contact</span>
        </Button>
      </div>

      {error && !formOpen && <p role="alert" className="text-sm text-red-300">{error}</p>}

      {contacts.length === 0 ? (
        <div className="flex flex-col items-center gap-3 text-center text-sm text-muted-foreground py-16 px-6 bg-card border border-dashed border-border-strong rounded-2xl">
          <IconBox tone="neutral">
            <Contact />
          </IconBox>
          No contacts yet. Messages sent from the contact page will appear here.
        </div>
      ) : (
        <div className="space-y-4">
          {contacts.map((contact) => (
            <Card key={contact.id} className="p-6 space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 space-y-1">
                  <CardTitle>{contact.name}</CardTitle>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <a href={`mailto:${contact.email}`} className="flex items-center gap-1.5 hover:text-primary break-all">
                      <Mail className="h-3.5 w-3.5 flex-shrink-0" />
                      {contact.email}
                    </a>
                    {contact.phone && (
                      <a href={`tel:${contact.phone}`} className="flex items-center gap-1.5 hover:text-primary">
                        <Phone className="h-3.5 w-3.5 flex-shrink-0" />
                        {contact.phone}
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant={contact.source === "admin" ? "accent" : "default"}>
                    {contact.source === "admin" ? "Added by admin" : "Contact form"}
                  </Badge>
                  <span className="text-xs text-subtle-foreground flex items-center">
                    <Clock className="h-3.5 w-3.5 mr-1" />
                    {formatDateTime(contact.timestamp)}
                  </span>
                </div>
              </div>

              {(contact.subject || contact.message) && (
                <div className="p-4 rounded-xl bg-surface border border-border text-sm text-body">
                  {contact.subject && (
                    <span className="font-semibold text-xs text-muted-foreground block mb-1.5">{contact.subject}</span>
                  )}
                  <p className="leading-relaxed whitespace-pre-wrap">{contact.message}</p>
                </div>
              )}

              {contact.aiDraft && (
                <details className="p-4 rounded-xl bg-primary-soft border border-primary-muted text-sm">
                  <summary className="font-semibold text-xs text-primary-hover cursor-pointer flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5" />
                    Drafted reply
                  </summary>
                  <p className="mt-3 p-3 rounded-lg bg-card border border-border text-body leading-relaxed whitespace-pre-wrap">
                    {contact.aiDraft}
                  </p>
                </details>
              )}

              <div className="flex justify-end">
                <Button variant="ghost" size="sm" onClick={() => handleDelete(contact)} className="text-red-300">
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Delete</span>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        title="Add contact"
        description="Keep a record of someone who reached you by phone, email or in person."
      >
        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <Label htmlFor="add-contact-name">Name</Label>
            <Input id="add-contact-name" required value={form.name} onChange={(e) => update("name", e.target.value)} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <Label htmlFor="add-contact-email">Email address</Label>
              <Input id="add-contact-email" type="email" required value={form.email} onChange={(e) => update("email", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="add-contact-phone">Phone number (optional)</Label>
              <Input id="add-contact-phone" type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
            </div>
          </div>
          <div>
            <Label htmlFor="add-contact-subject">Subject (optional)</Label>
            <Input id="add-contact-subject" value={form.subject} onChange={(e) => update("subject", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="add-contact-message">Notes (optional)</Label>
            <Textarea id="add-contact-message" rows={4} value={form.message} onChange={(e) => update("message", e.target.value)} />
          </div>
          {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
          <Button type="submit" size="lg" disabled={saving} className="w-full">
            {saving ? "Saving..." : "Save contact"}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
