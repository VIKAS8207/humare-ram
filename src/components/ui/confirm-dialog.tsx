"use client";

import Modal from "./modal";
import { Button } from "./button";

// "Are you sure?" popup: a question, one line of explanation and two buttons.
// Used for cancel ticket, release seats, leave booking...
export default function ConfirmDialog({
  title,
  children,
  cancelLabel = "Cancel",
  confirmLabel,
  tone = "danger",
  onCancel,
  onConfirm,
}: {
  title: string;
  children: React.ReactNode;
  /** The safe button (closes the popup) */
  cancelLabel?: string;
  /** The button that does the thing */
  confirmLabel: string;
  tone?: "danger" | "primary";
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal title={title} onClose={onCancel}>
      <div className="text-sm text-ink-muted">{children}</div>
      <div className="mt-6 flex gap-3">
        <Button variant="outline" grow onClick={onCancel}>
          {cancelLabel}
        </Button>
        <Button variant={tone} grow onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
