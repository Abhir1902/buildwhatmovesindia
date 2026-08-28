"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Modal = Dialog.Root;
export const ModalTrigger = Dialog.Trigger;

export function ModalContent({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-50 bg-neutral-950/30 data-[state=open]:animate-fade-in" />
      <Dialog.Content
        className={cn(
          "fixed left-1/2 top-1/2 z-50 w-[min(92vw,440px)] -translate-x-1/2 -translate-y-1/2 rounded-lg border border-neutral-200 bg-white p-6 shadow-[0_12px_40px_rgba(0,0,0,0.08)] data-[state=open]:animate-rise",
          className,
        )}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <Dialog.Title className="text-lg font-medium tracking-tight">{title}</Dialog.Title>
          <Dialog.Close className="rounded-md p-1 text-neutral-500 hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/20">
            <X className="size-4" aria-hidden />
            <span className="sr-only">Close</span>
          </Dialog.Close>
        </div>
        {children}
      </Dialog.Content>
    </Dialog.Portal>
  );
}
