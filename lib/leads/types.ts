export const LEAD_SOURCES = [
  "CTA",
  "Popup",
  "WhatsApp",
  "Instagram",
  "Email",
  "Walk-in",
] as const;

export const LEAD_STATUSES = [
  "New",
  "Quoted",
  "Booked",
  "Confirmed",
  "Completed",
  "Inactive",
] as const;

export type LeadSource = (typeof LEAD_SOURCES)[number];
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export interface LeadInput {
  name: string;
  email?: string;
  phone?: string;
  website?: string;
  instagram?: string;
  source: LeadSource;
  notes?: string;
  appointmentDate?: string;
}

export interface LeadRecord extends LeadInput {
  status: LeadStatus;
  lastContact?: string;
  reactivationSent?: boolean;
  reviewRequested?: string;
}

export interface DispatchResult {
  notion?: { pageId: string };
  manychat?: { subscriberId: string };
  telegram?: { sent: boolean };
  email?: { sent: boolean };
  errors: string[];
}
