import type { Attendee } from '$lib/attendee';

export interface Booking {
  id: number;
  reference: string;
  completed_at: Date | null;
  cancelled_at: Date | null;
  early_bird: boolean | null;
  billing_first_name: string | null;
  billing_last_name: string | null;
  billing_email_address: string | null;
  billing_organisation: string | null;
  billing_position: string | null;
  billing_address: string | null;
  billing_address_city: string | null;
  billing_address_region: string | null;
  billing_address_post_code: string | null;
  billing_address_country: string | null;
  price_excluding_tax: string | null;
  tax: string;
  price_including_tax: string;
  payment_type: "complimentary" | "credit_card" | "invoice" | "manual" | "no_charge" | "paypal" | "stripe" | null;
  invoice_numbers: string[];
  xero_invoice_references: string[];
  paid: boolean;
  purchase_order_number: string | null;
  attendees: Attendee[];
  amount_paid: string;
  balance: string;
  date_paid: Date | null;
}
