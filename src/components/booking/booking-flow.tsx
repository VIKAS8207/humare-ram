"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap, useGSAP } from "@/lib/gsap";
import { IMAGES } from "@/config/images";
import { startPayment } from "@/lib/payment";
import type { Attendee, Confirmation, Selection } from "./booking.types";
import { inr, showKeyOf, validateAttendee } from "./booking.utils";
import ConfirmationView from "./confirmation";
import Stepper, { STEPS } from "./stepper";
import DateTimeStep from "./steps/datetime-step";
import ReviewPayStep from "./steps/review-pay-step";
import SeatsStep from "./steps/seats-step";
import VenueStep from "./steps/venue-step";
import SummaryPanel, { totalOf } from "./summary-panel";

const LAST_STEP = STEPS.length - 1;

function StepNav({
  step,
  canNext,
  paying,
  total,
  onBack,
  onNext,
}: {
  step: number;
  canNext: boolean;
  paying: boolean;
  total: number;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex items-center gap-3">
      {step > 0 && (
        <button
          type="button"
          onClick={onBack}
          disabled={paying}
          className="rounded-full border border-bk-line px-6 py-3 text-sm font-medium transition-colors hover:border-bk-ink disabled:opacity-40"
        >
          Back
        </button>
      )}
      <button
        type="button"
        onClick={onNext}
        disabled={!canNext || paying}
        className="flex-1 rounded-full bg-bk-accent px-6 py-3 text-sm font-semibold text-bk-accent-ink transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
      >
        {step < LAST_STEP
          ? "Continue"
          : paying
            ? "Processing…"
            : `Pay ${inr(total)}`}
      </button>
    </div>
  );
}

export default function BookingFlow() {
  const [step, setStep] = useState(0);
  const [selection, setSelection] = useState<Selection>({
    venueId: null,
    date: null,
    time: null,
    quantity: null,
    seats: [],
  });
  const [attendee, setAttendee] = useState<Attendee>({
    name: "",
    email: "",
    phone: "",
  });
  const [terms, setTerms] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
  const content = useRef<HTMLDivElement>(null);

  // Fade/slide each step in and return to the top of the page
  useGSAP(
    () => {
      window.scrollTo(0, 0);
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          content.current,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power3.out",
            clearProps: "transform",
          },
        );
      });
      return () => mm.revert();
    },
    { dependencies: [step, confirmation], scope: content },
  );

  // Changing an earlier choice clears everything that depended on it
  const selectVenue = (venueId: string) =>
    setSelection((s) => ({ ...s, venueId, date: null, time: null, seats: [] }));
  const selectDate = (date: string) =>
    setSelection((s) => ({ ...s, date, time: null, seats: [] }));
  const selectTime = (time: string) =>
    setSelection((s) => ({ ...s, time, seats: [] }));
  // How many seats: trims the picked seats if the number goes down
  const setQuantity = (quantity: number) =>
    setSelection((s) => ({
      ...s,
      quantity,
      seats: s.seats.slice(0, quantity),
    }));
  const setSeats = (seats: string[]) => setSelection((s) => ({ ...s, seats }));

  const errors = validateAttendee(attendee);
  const total = totalOf(selection.seats);
  const stepValid = [
    Boolean(selection.venueId),
    Boolean(selection.date && selection.time),
    selection.quantity !== null &&
      selection.seats.length === selection.quantity,
    true, // review step: errors are shown on submit
  ][step];

  const pay = async () => {
    if (Object.keys(errors).length > 0 || !terms) {
      setShowErrors(true);
      return;
    }
    setPayError(null);
    setPaying(true);
    try {
      const { reference } = await startPayment({
        venueId: selection.venueId!,
        date: selection.date!,
        time: selection.time!,
        seats: selection.seats,
        amount: total,
        attendee,
      });
      setConfirmation({ reference });
    } catch {
      setPayError(
        "Payment could not be completed. You have not been charged. Please try again.",
      );
    } finally {
      setPaying(false);
    }
  };

  const next = () => (step < LAST_STEP ? setStep(step + 1) : pay());
  const back = () => setStep((s) => Math.max(0, s - 1));

  return (
    <div className="min-h-screen bg-bk-bg text-bk-ink">
      <header className="border-b border-bk-line">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" aria-label="Humare Ram — home">
            <Image
              src={IMAGES.heroLogo.src}
              alt="Humare Ram"
              width={IMAGES.heroLogo.width}
              height={IMAGES.heroLogo.height}
              sizes="96px"
              className="h-9 w-auto select-none"
            />
          </Link>
          <Link
            href="/"
            aria-label="Close and go back to the site"
            className="grid size-10 place-content-center rounded-full border border-bk-line text-bk-muted transition-colors hover:border-bk-ink hover:text-bk-ink"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              aria-hidden
            >
              <path d="M1.5 1.5l11 11M12.5 1.5l-11 11" />
            </svg>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-32 pt-8 lg:pb-16">
        {confirmation ? (
          <div ref={content}>
            <ConfirmationView
              selection={selection}
              attendee={attendee}
              confirmation={confirmation}
            />
          </div>
        ) : (
          <>
            <Stepper step={step} onStepClick={(i) => !paying && setStep(i)} />

            <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_22rem] lg:gap-14">
              <div ref={content} className="min-w-0">
                {step === 0 && (
                  <VenueStep
                    venueId={selection.venueId}
                    onSelect={selectVenue}
                  />
                )}
                {step === 1 && selection.venueId && (
                  <DateTimeStep
                    venueId={selection.venueId}
                    date={selection.date}
                    time={selection.time}
                    onDate={selectDate}
                    onTime={selectTime}
                  />
                )}
                {step === 2 &&
                  selection.venueId &&
                  selection.date &&
                  selection.time && (
                    <SeatsStep
                      showKey={showKeyOf(
                        selection.venueId,
                        selection.date,
                        selection.time,
                      )}
                      quantity={selection.quantity}
                      seats={selection.seats}
                      onQuantity={setQuantity}
                      onSeats={setSeats}
                    />
                  )}
                {step === 3 && (
                  <ReviewPayStep
                    seats={selection.seats}
                    attendee={attendee}
                    errors={errors}
                    showErrors={showErrors}
                    terms={terms}
                    paying={paying}
                    payError={payError}
                    onAttendee={(field, value) =>
                      setAttendee((a) => ({ ...a, [field]: value }))
                    }
                    onTerms={setTerms}
                  />
                )}
              </div>

              <aside className="lg:sticky lg:top-8 lg:self-start">
                <SummaryPanel selection={selection}>
                  <div className="hidden lg:block">
                    <StepNav
                      step={step}
                      canNext={stepValid}
                      paying={paying}
                      total={total}
                      onBack={back}
                      onNext={next}
                    />
                  </div>
                </SummaryPanel>
              </aside>
            </div>

            {/* Mobile action bar */}
            <div className="fixed inset-x-0 bottom-0 z-30 border-t border-bk-line bg-bk-bg/90 px-6 py-4 backdrop-blur lg:hidden">
              <div className="mx-auto flex max-w-6xl items-center gap-4">
                <div className="flex flex-col">
                  <span className="text-[0.65rem] uppercase tracking-[0.2em] text-bk-muted">
                    Total
                  </span>
                  <span className="text-lg font-semibold">{inr(total)}</span>
                </div>
                <div className="flex-1">
                  <StepNav
                    step={step}
                    canNext={stepValid}
                    paying={paying}
                    total={total}
                    onBack={back}
                    onNext={next}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
