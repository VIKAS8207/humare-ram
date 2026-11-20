import { Button } from "@/components/ui";

// Back / Continue buttons shown in the bottom booking bar. Shared by the public
// booking flow and the admin booking flow.
export default function StepNav({
  showBack = true,
  onBack,
  backDisabled = false,
  nextLabel,
  canNext,
  onNext,
}: {
  showBack?: boolean;
  onBack: () => void;
  backDisabled?: boolean;
  nextLabel: string;
  canNext: boolean;
  onNext: () => void;
}) {
  return (
    <div className="flex items-center gap-1.5 md:gap-3">
      {showBack && (
        <Button
          variant="outline"
          size="adaptive"
          onClick={onBack}
          disabled={backDisabled}
        >
          Back
        </Button>
      )}
      <Button grow size="adaptive" onClick={onNext} disabled={!canNext}>
        {nextLabel}
      </Button>
    </div>
  );
}
