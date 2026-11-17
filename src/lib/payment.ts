// ─────────────────────────────────────────────────────────────────────────────
// PAYMENT STUB — no real payment is taken.
// To go live, replace `startPayment` with your gateway (Razorpay, Cashfree,
// Stripe, …): create the order on your server, open the gateway checkout, and
// resolve with the verified reference only after the server confirms payment.
// Set PAYMENTS_ENABLED = true once that is wired up (it hides the demo notice).
// ─────────────────────────────────────────────────────────────────────────────

export const PAYMENTS_ENABLED = false;

export type Order = {
  venueId: string;
  date: string;
  time: string;
  seats: string[];
  amount: number; // INR
  attendee: { name: string; email: string; phone: string };
};

export async function startPayment(
  order: Order,
): Promise<{ reference: string }> {
  void order;
  await new Promise((r) => setTimeout(r, 1500)); // pretend to talk to a gateway
  const reference = `HR-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  return { reference };
}
