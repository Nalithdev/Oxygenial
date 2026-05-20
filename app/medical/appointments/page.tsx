"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { Plus } from "lucide-react";
import { orpc } from "@/lib/orpc-client";
import { verticalFadeIn } from "@/lib/animations";
import { Button } from "@/components/ui/button";
import { MedicalDashboardLayout } from "../_components/medical-layout";
import { BookingCalendar } from "./_components/booking-calendar";
import { CreateBookingDialog } from "./_components/create-booking-dialog";

export default function MedicalAppointmentsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: bookings = [], isPending } = useQuery(
    orpc.booking.listMedical.queryOptions({ input: { limit: 200 } })
  );

  return (
    <MedicalDashboardLayout>
      <motion.div
        initial="initial"
        animate="animate"
        transition={{ staggerChildren: 0.1 }}
        className="space-y-6"
      >
        <motion.div variants={verticalFadeIn} className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Rendez-vous</h1>
            <p className="text-slate-600 mt-1">
              Planifiez et gérez les visites médicales
            </p>
          </div>
          <Button onClick={() => setDialogOpen(true)} className="shrink-0">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau rendez-vous
          </Button>
        </motion.div>

        <motion.div variants={verticalFadeIn}>
          {isPending ? (
            <div className="flex items-center justify-center py-24">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
            </div>
          ) : (
            <BookingCalendar bookings={bookings} role="medical" />
          )}
        </motion.div>
      </motion.div>

      <CreateBookingDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </MedicalDashboardLayout>
  );
}
