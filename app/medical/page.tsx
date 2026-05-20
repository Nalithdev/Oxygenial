"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { Building2, Users, Inbox, Calendar, ChevronRight, Clock, MapPin } from "lucide-react";
import Link from "next/link";
import { orpc } from "@/lib/orpc-client";
import { verticalFadeIn } from "@/lib/animations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MedicalDashboardLayout } from "./_components/medical-layout";
import { BookingDetailSheet } from "./appointments/_components/booking-detail-sheet";
import type { InferRouterOutputs } from "@orpc/server";
import type { AppRouter } from "@/server/router";

type Booking = InferRouterOutputs<AppRouter>["booking"]["listMedical"][number];

export default function MedicalDashboardPage() {
  const router = useRouter();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const statusQuery = useQuery(orpc.onboarding.getStatus.queryOptions({}));
  const dashboardQuery = useQuery(orpc.medical.getDashboard.queryOptions({}));
  const bookingsQuery = useQuery(
    orpc.booking.listMedical.queryOptions({ input: { upcoming: true, limit: 100 } })
  );

  useEffect(() => {
    if (statusQuery.isSuccess && statusQuery.data?.type !== "medical_staff") {
      router.push("/onboarding");
    }
  }, [statusQuery.isSuccess, statusQuery.data, router]);

  if (statusQuery.isPending || dashboardQuery.isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
      </div>
    );
  }

  const dashboard = dashboardQuery.data;
  const pendingBookings = bookingsQuery.data?.filter((b) => b.status === "pending") ?? [];
  const upcomingBookings = bookingsQuery.data?.filter(
    (b) => b.status === "scheduled" && new Date(b.scheduledAt) > new Date()
  ) ?? [];

  function openBooking(booking: Booking) {
    setSelectedBooking(booking);
    setSheetOpen(true);
  }

  return (
    <MedicalDashboardLayout>
      <motion.div
        initial="initial"
        animate="animate"
        transition={{ staggerChildren: 0.1 }}
        className="space-y-8"
      >
        {/* En-tête */}
        <motion.div variants={verticalFadeIn}>
          <h1 className="text-2xl font-bold text-slate-900">Tableau de bord</h1>
          <p className="text-slate-500 mt-1">{dashboard?.medicalCompany?.name}</p>
        </motion.div>

        {/* Statistiques */}
        <motion.div variants={verticalFadeIn} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-slate-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                  <Inbox className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{dashboard?.stats?.pendingRequestsCount ?? 0}</p>
                  <p className="text-sm text-slate-500">Nouvelles demandes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{dashboard?.stats?.totalClients ?? 0}</p>
                  <p className="text-sm text-slate-500">Entreprises clientes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                  <Users className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{dashboard?.stats?.totalEmployees ?? 0}</p>
                  <p className="text-sm text-slate-500">Employés suivis</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center shrink-0">
                  <Calendar className="w-6 h-6 text-violet-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{upcomingBookings.length}</p>
                  <p className="text-sm text-slate-500">RDV à venir</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Demandes */}
        <motion.div variants={verticalFadeIn} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Nouvelles demandes */}
          <Card className="border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base font-semibold">Nouvelles demandes</CardTitle>
              <Link href="/medical/requests">
                <Button variant="ghost" size="sm" className="text-xs">
                  Voir tout <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {!dashboard?.pendingRequests?.length ? (
                <div className="text-center py-8 text-slate-400">
                  <Inbox className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                  <p className="text-sm">Aucune nouvelle demande</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {dashboard.pendingRequests.map((request) => (
                    <Link
                      key={request.id}
                      href={`/medical/requests/${request.id}`}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group"
                    >
                      <div className="w-9 h-9 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
                        <Building2 className="w-4 h-4 text-amber-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 truncate text-sm">{request.clientCompany?.name}</p>
                        <p className="text-xs text-slate-400">
                          {new Date(request.createdAt).toLocaleDateString("fr-FR", {
                            day: "numeric", month: "short",
                          })}
                        </p>
                      </div>
                      <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 text-xs shrink-0">
                        En attente
                      </Badge>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Entreprises clientes */}
          <Card className="border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base font-semibold">Entreprises clientes</CardTitle>
              <Link href="/medical/company">
                <Button variant="ghost" size="sm" className="text-xs">
                  Gérer <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {!dashboard?.clientCompanies?.length ? (
                <div className="text-center py-8 text-slate-400">
                  <Building2 className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                  <p className="text-sm">Aucune entreprise cliente</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {dashboard.clientCompanies.slice(0, 5).map((company) => (
                    <div key={company.id} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
                      <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                        <Building2 className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 truncate text-sm">{company.name}</p>
                        {(company.city || company.postalCode) && (
                          <p className="text-xs text-slate-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {company.postalCode} {company.city}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-500 shrink-0">
                        <Users className="w-3.5 h-3.5" />
                        {company.employees.length}
                      </div>
                    </div>
                  ))}
                  {dashboard.clientCompanies.length > 5 && (
                    <p className="text-xs text-slate-400 text-center pt-1">
                      +{dashboard.clientCompanies.length - 5} autres entreprises
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Rendez-vous */}
        <motion.div variants={verticalFadeIn} className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* À confirmer */}
          <Card className="border-slate-200 flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-3 shrink-0">
              <div className="flex items-center gap-2">
                <CardTitle className="text-base font-semibold">Rendez-vous à confirmer</CardTitle>
                {pendingBookings.length > 0 && (
                  <span className="inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold">
                    {pendingBookings.length}
                  </span>
                )}
              </div>
              <Link href="/medical/appointments">
                <Button variant="ghost" size="sm">
                  Voir tout <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="flex-1">
              {!pendingBookings.length ? (
                <div className="flex flex-col items-center justify-center h-full py-8 text-slate-400">
                  <Calendar className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                  <p className="text-sm">Aucun rendez-vous à confirmer</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {pendingBookings.slice(0, 5).map((booking) => (
                    <button
                      key={booking.id}
                      onClick={() => openBooking(booking)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors text-left"
                    >
                      <div className="w-9 h-9 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
                        <Clock className="w-4 h-4 text-amber-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 truncate text-sm">{booking.employee?.user?.name}</p>
                        <p className="text-xs text-slate-500 truncate">
                          {booking.employee?.clientCompany?.name} ·{" "}
                          {new Date(booking.scheduledAt).toLocaleDateString("fr-FR", {
                            weekday: "short", day: "numeric", month: "short",
                            hour: "2-digit", minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 text-xs shrink-0 border-0">
                        En attente
                      </Badge>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Prochains */}
          <Card className="border-slate-200 flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-3 shrink-0">
              <CardTitle className="text-base font-semibold">Prochains rendez-vous</CardTitle>
              <Link href="/medical/appointments">
                <Button variant="ghost" size="sm">
                  Voir tout <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="flex-1">
              {!upcomingBookings.length ? (
                <div className="flex flex-col items-center justify-center h-full py-8 text-slate-400">
                  <Calendar className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                  <p className="text-sm">Aucun rendez-vous planifié</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {upcomingBookings.slice(0, 5).map((booking) => (
                    <button
                      key={booking.id}
                      onClick={() => openBooking(booking)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors text-left"
                    >
                      <div className="w-9 h-9 bg-violet-100 rounded-lg flex items-center justify-center shrink-0">
                        <Clock className="w-4 h-4 text-violet-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 truncate text-sm">{booking.employee?.user?.name}</p>
                        <p className="text-xs text-slate-400 truncate">
                          {booking.employee?.clientCompany?.name} ·{" "}
                          {new Date(booking.scheduledAt).toLocaleDateString("fr-FR", {
                            weekday: "short", day: "numeric", month: "short",
                            hour: "2-digit", minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <Badge className="bg-violet-100 text-violet-700 hover:bg-violet-100 text-xs shrink-0 border-0">
                        Confirmé
                      </Badge>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <BookingDetailSheet
        booking={selectedBooking}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        role="medical"
      />
    </MedicalDashboardLayout>
  );
}
