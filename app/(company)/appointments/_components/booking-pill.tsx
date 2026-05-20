import { Ban } from "lucide-react";
import { cn } from "@/lib/utils";
import type { InferRouterOutputs } from "@orpc/server";
import type { AppRouter } from "@/server/router";

type Booking = InferRouterOutputs<AppRouter>["booking"]["list"][number];

const STATUS_STYLES: Record<string, string> = {
  scheduled: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  pending:   "bg-amber-100 text-amber-800 hover:bg-amber-200",
  cancelled: "bg-slate-100 text-slate-400 hover:bg-slate-200",
  completed: "bg-emerald-100 text-emerald-800 hover:bg-emerald-200",
};

type Props = {
  booking: Booking;
  onClick: (booking: Booking) => void;
  compact?: boolean;
};

export function BookingPill({ booking, onClick, compact }: Props) {
  const time = new Date(booking.scheduledAt).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const firstName = booking.employee?.user?.name?.split(" ")[0] ?? "—";
  const style = STATUS_STYLES[booking.status] ?? STATUS_STYLES.scheduled;
  const isCancelled = booking.status === "cancelled";

  return (
    <button
      onClick={() => onClick(booking)}
      className={cn(
        "w-full text-left rounded px-1.5 py-0.5 text-xs font-medium transition-colors flex items-center gap-1 min-w-0",
        style,
        isCancelled && "line-through opacity-60"
      )}
      title={`${booking.employee?.user?.name} à ${time}${isCancelled ? " (annulé)" : ""}`}
    >
      {isCancelled && <Ban className="h-2.5 w-2.5 shrink-0" />}
      <span className="truncate">
        {compact ? firstName : `${time} ${firstName}`}
      </span>
    </button>
  );
}
