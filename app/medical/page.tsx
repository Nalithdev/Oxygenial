"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { Building2, Users, Inbox, Calendar, ChevronRight, Clock } from "lucide-react";
import Link from "next/link";
import { orpc } from "@/lib/orpc-client";
import { verticalFadeIn } from "@/lib/animations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MedicalDashboardLayout } from "./_components/medical-layout";

export default function MedicalDashboardPage() {
  const router = useRouter();

  const statusQuery = useQuery(
    orpc.onboarding.getStatus.queryOptions({})
  );

  const dashboardQuery = useQuery(
    orpc.medical.getDashboard.queryOptions({})
  );

  useEffect(() => {
    if (!statusQuery.isPending && statusQuery.data?.type !== "medical_staff") {
      router.push("/onboarding");
    }
  }, [statusQuery.data, statusQuery.isPending, router]);

  if (statusQuery.isPending || dashboardQuery.isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
      </div>
    );
  }

  const dashboard = dashboardQuery.data;

  return (
    <MedicalDashboardLayout>
      <motion.div
        initial="initial"
        animate="animate"
        transition={{ staggerChildren: 0.1 }}
        className="space-y-8"
      >
        <motion.div variants={verticalFadeIn}>
          <h1 className="text-2xl font-bold text-slate-900">
            Tableau de bord
          </h1>
          <p className="text-slate-600 mt-1">
            {dashboard?.medicalCompany?.name}
          </p>
        </motion.div>

        <motion.div variants={verticalFadeIn} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-slate-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                  <Inbox className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">
                    {dashboard?.stats?.pendingRequestsCount ?? 0}
                  </p>
                  <p className="text-sm text-slate-500">Demandes en attente</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">
                    {dashboard?.stats?.totalClients ?? 0}
                  </p>
                  <p className="text-sm text-slate-500">Entreprises clientes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">
                    {dashboard?.stats?.totalEmployees ?? 0}
                  </p>
                  <p className="text-sm text-slate-500">Employés suivis</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-violet-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">
                    {dashboard?.stats?.upcomingBookingsCount ?? 0}
                  </p>
                  <p className="text-sm text-slate-500">RDV à venir</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div variants={verticalFadeIn}>
            <Card className="border-slate-200">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Demandes en attente</CardTitle>
                <Link href="/medical/requests">
                  <Button variant="ghost" size="sm">
                    Voir tout
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {dashboard?.pendingRequests?.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <Inbox className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                    <p>Aucune demande en attente</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {dashboard?.pendingRequests?.map((request) => (
                      <Link
                        key={request.id}
                        href={`/medical/requests/${request.id}`}
                        className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                      >
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-slate-200">
                          <Building2 className="w-5 h-5 text-slate-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-900 truncate">
                            {request.clientCompany?.name}
                          </p>
                          <p className="text-sm text-slate-500">
                            {new Date(request.createdAt).toLocaleDateString("fr-FR")}
                          </p>
                        </div>
                        <Badge variant="secondary">En attente</Badge>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={verticalFadeIn}>
            <Card className="border-slate-200">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Prochains rendez-vous</CardTitle>
              </CardHeader>
              <CardContent>
                {dashboard?.upcomingBookings?.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <Calendar className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                    <p>Aucun rendez-vous à venir</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {dashboard?.upcomingBookings?.slice(0, 5).map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-center gap-3 p-3 rounded-lg bg-slate-50"
                      >
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-slate-200">
                          <Clock className="w-5 h-5 text-slate-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-900 truncate">
                            {booking.employee?.user?.name}
                          </p>
                          <p className="text-sm text-slate-500">
                            {booking.employee?.clientCompany?.name} •{" "}
                            {new Date(booking.scheduledAt).toLocaleDateString("fr-FR", {
                              weekday: "short",
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </MedicalDashboardLayout>
  );
}

