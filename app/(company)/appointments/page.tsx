"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { orpc } from "@/lib/orpc-client";
import { verticalFadeIn } from "@/lib/animations";
import { DashboardLayout } from "../dashboard/_components/dashboard-layout";
import { BookingCalendar } from "./_components/booking-calendar";

export default function AppointmentsPage() {
  const { data: bookings = [], isPending } = useQuery(
    orpc.booking.list.queryOptions({ input: { limit: 200 } })
  );

  return (
    <DashboardLayout>
      <motion.div
        initial="initial"
        animate="animate"
        transition={{ staggerChildren: 0.1 }}
        className="space-y-6"
      >
        <motion.div variants={verticalFadeIn}>
          <h1 className="text-2xl font-bold text-slate-900">Rendez-vous</h1>
          <p className="text-slate-600 mt-1">
            Gérez et suivez les visites médicales de vos employés
          </p>
        </motion.div>

        <motion.div variants={verticalFadeIn}>
          {isPending ? (
            <div className="flex items-center justify-center py-24">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
            </div>
          ) : (
            <BookingCalendar bookings={bookings} role="company" />
          )}
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}
