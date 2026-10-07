"use client";

import React from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastVariant = "success" | "error" | "info" | "warning";

interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
}

let globalAddToast: ((msg: Omit<ToastMessage, "id">) => void) | null = null;

export const toast = {
  success: (title: string, description?: string) => {
    globalAddToast?.({ title, description, variant: "success" });
  },
  error: (title: string, description?: string) => {
    globalAddToast?.({ title, description, variant: "error" });
  },
  info: (title: string, description?: string) => {
    globalAddToast?.({ title, description, variant: "info" });
  },
  warning: (title: string, description?: string) => {
    globalAddToast?.({ title, description, variant: "warning" });
  },
};

const VARIANT_STYLES: Record<ToastVariant, string> = {
  success: "border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400",
  error: "border-destructive/30 bg-destructive/10 text-destructive",
  info: "border-primary/30 bg-primary/10 text-primary",
  warning: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400",
};

const VARIANT_ICONS: Record<ToastVariant, React.FC<any>> = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

export function ToastContainer() {
  const [toasts, setToasts] = React.useState<ToastMessage[]>([]);

  React.useEffect(() => {
    globalAddToast = (msg) => {
      const id = Math.random().toString(36).substring(7);
      setToasts((prev) => [...prev, { ...msg, id }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    };
    return () => {
      globalAddToast = null;
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-80">
      {toasts.map((t) => {
        const Icon = VARIANT_ICONS[t.variant];
        return (
          <div
            key={t.id}
            className={cn(
              "flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-sm animate-fade-in",
              VARIANT_STYLES[t.variant]
            )}
          >
            <Icon className="h-4 w-4 mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">{t.title}</p>
              {t.description && (
                <p className="text-xs mt-0.5 opacity-80">{t.description}</p>
              )}
            </div>
            <button
              onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
              className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
