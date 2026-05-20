"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCalendar, groupBookingsByDate } from "@/hooks/use-calendar";
import { BookingPill } from "./booking-pill";
import { BookingDetailSheet } from "./booking-detail-sheet";
import type { InferRouterOutputs } from "@orpc/server";
import type { AppRouter } from "@/server/router";

type Booking = InferRouterOutputs<AppRouter>["booking"]["listMedical"][number];

const DAY_LABELS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  pending:   { label: "En attente", className: "bg-amber-100 text-amber-800 border-amber-200" },
  scheduled: { label: "Confirmé",   className: "bg-blue-100 text-blue-800 border-blue-200" },
  completed: { label: "Terminé",    className: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  cancelled: { label: "Annulé",     className: "bg-slate-100 text-slate-500 border-slate-200" },
};

type Props = {
  bookings: Booking[];
  role?: "company" | "medical";
};

export function BookingCalendar({ bookings, role = "company" }: Props) {
  const { days, monthLabel, prevMonth, nextMonth, goToToday } = useCalendar();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const bookingsByDate = groupBookingsByDate(bookings);

  const upcoming = useMemo<Booking[]>(() => {
    const now = new Date();
    return [...bookings]
      .filter((b) => b.status === "scheduled" && new Date(b.scheduledAt) >= now)
      .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
      .slice(0, 12);
  }, [bookings]);

  function handleBookingClick(booking: Booking) {
    setSelectedBooking(booking);
    setSheetOpen(true);
  }

  return (
    <>
      <div className="flex gap-5 h-full">
        {/* Calendar — left, takes remaining space */}
        <div className="flex flex-col min-w-0 flex-1">
          {/* Header */}
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-sm font-semibold capitalize text-foreground flex-1">
              {monthLabel}
            </h2>
            <Button variant="outline" size="sm" onClick={goToToday} className="text-xs h-7 px-2.5">
              Aujourd&apos;hui
            </Button>
            <Button variant="outline" size="icon" className="h-7 w-7" onClick={prevMonth}>
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            <Button variant="outline" size="icon" className="h-7 w-7" onClick={nextMonth}>
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Grid */}
          <div className="border border-border rounded-xl overflow-hidden">
            {/* Day labels */}
            <div className="grid grid-cols-7 border-b border-border bg-muted/30">
              {DAY_LABELS.map((label) => (
                <div
                  key={label}
                  className="py-1.5 text-center text-[10px] font-medium text-muted-foreground tracking-wide uppercase"
                >
                  {label}
                </div>
              ))}
            </div>

            {/* Day cells */}
            <div className="grid grid-cols-7 divide-x divide-y divide-border">
              {days.map((day, i) => {
                const key = `${day.date.getFullYear()}-${String(day.date.getMonth() + 1).padStart(2, "0")}-${String(day.date.getDate()).padStart(2, "0")}`;
                const dayBookings = bookingsByDate.get(key) ?? [];
                const MAX_VISIBLE = 2;
                const visible = dayBookings.slice(0, MAX_VISIBLE);
                const overflow = dayBookings.length - MAX_VISIBLE;

                return (
                  <div
                    key={i}
                    className={cn(
                      "min-h-[80px] p-1 flex flex-col gap-0.5 relative",
                      !day.isCurrentMonth && "bg-muted/20",
                      day.isWeekend && day.isCurrentMonth && "bg-slate-50/60 dark:bg-slate-900/20"
                    )}
                  >
                    <span
                      className={cn(
                        "text-[11px] font-medium self-start leading-none w-5 h-5 flex items-center justify-center rounded-full mb-0.5",
                        day.isToday
                          ? "bg-primary text-primary-foreground font-semibold"
                          : day.isCurrentMonth
                          ? "text-foreground"
                          : "text-muted-foreground/40"
                      )}
                    >
                      {day.dayNumber}
                    </span>

                    <div className="flex flex-col gap-0.5 w-full overflow-hidden">
                      {visible.map((booking) => (
                        <BookingPill
                          key={booking.id}
                          booking={booking}
                          onClick={handleBookingClick}
                        />
                      ))}
                      {overflow > 0 && (
                        <span className="text-[10px] text-muted-foreground pl-1">
                          +{overflow}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Upcoming sidebar — right, fixed width */}
        <div className="w-64 shrink-0 flex flex-col">
          <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
            À venir
          </h2>

          <div className="border border-border rounded-xl overflow-hidden flex flex-col">
            {upcoming.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-muted-foreground gap-2">
                <Clock className="h-7 w-7 opacity-30" />
                <span className="text-xs">Aucun rendez-vous à venir</span>
              </div>
            ) : (
              <ul className="divide-y divide-border overflow-y-auto max-h-[calc(100vh-200px)]">
                {upcoming.map((booking) => {
                  const date = new Date(booking.scheduledAt);
                  const status = STATUS_CONFIG[booking.status] ?? STATUS_CONFIG.pending;
                  return (
                    <li key={booking.id}>
                      <button
                        onClick={() => handleBookingClick(booking)}
                        className="w-full text-left px-3 py-2.5 hover:bg-muted/50 transition-colors group"
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <span className="text-xs font-medium text-foreground truncate leading-tight group-hover:text-primary transition-colors">
                            {booking.employee?.user?.name ?? "—"}
                          </span>
                          <span className={cn(
                            "text-[10px] px-1.5 py-0.5 rounded border shrink-0 font-medium leading-none",
                            status.className
                          )}>
                            {status.label}
                          </span>
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          <span className="capitalize">
                            {date.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" })}
                          </span>
                          <span className="mx-1 opacity-40">·</span>
                          <span>
                            {date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>

      <BookingDetailSheet
        booking={selectedBooking}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        role={role}
      />
    </>
  );
}
