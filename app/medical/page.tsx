"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import {
  Building2,
  Users,
  Inbox,
  Calendar,
  ChevronRight,
  Clock,
  CheckCircle2,
  MapPin,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { orpc } from "@/lib/orpc-client";
import { verticalFadeIn } from "@/lib/animations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MedicalDashboardLayout } from "./_components/medical-layout";

export default function MedicalDashboardPage() {
  const router = useRouter();

  const statusQuery = useQuery(orpc.onboarding.getStatus.queryOptions({}));
  const dashboardQuery = useQuery(orpc.medical.getDashboard.queryOptions({}));

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
                  <p className="text-2xl font-bold text-slate-900">
                    {dashboard?.stats?.pendingRequestsCount ?? 0}
                  </p>
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
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
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
                <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center shrink-0">
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
                        <p className="font-medium text-slate-900 truncate text-sm">
                          {request.clientCompany?.name}
                        </p>
                        <p className="text-xs text-slate-400">
                          {new Date(request.createdAt).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "short",
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

          {/* Demandes en cours */}
          <Card className="border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base font-semibold">Demandes en cours</CardTitle>
              <Link href="/medical/requests">
                <Button variant="ghost" size="sm" className="text-xs">
                  Voir tout <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {!dashboard?.acceptedRequests?.length ? (
                <div className="text-center py-8 text-slate-400">
                  <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                  <p className="text-sm">Aucune demande acceptée récemment</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {dashboard.acceptedRequests.map((request) => (
                    <Link
                      key={request.id}
                      href={`/medical/requests/${request.id}`}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group"
                    >
                      <div className="w-9 h-9 bg-emerald-100 rounded-lg flex items-center justify-center shrink-0">
                        <Building2 className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 truncate text-sm">
                          {request.clientCompany?.name}
                        </p>
                        <p className="text-xs text-slate-400">
                          Acceptée le{" "}
                          {new Date(request.updatedAt).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "short",
                          })}
                        </p>
                      </div>
                      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 text-xs shrink-0">
                        Acceptée
                      </Badge>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Entreprises & Échanges */}
        <motion.div variants={verticalFadeIn} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Informations entreprises */}
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
                    <div
                      key={company.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-slate-50"
                    >
                      <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                        <Building2 className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 truncate text-sm">
                          {company.name}
                        </p>
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

          {/* Échanges — prochains rendez-vous */}
          <Card className="border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base font-semibold">Prochains échanges</CardTitle>
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <TrendingUp className="w-3.5 h-3.5" />
                {dashboard?.stats?.upcomingBookingsCount ?? 0} planifiés
              </div>
            </CardHeader>
            <CardContent>
              {!dashboard?.upcomingBookings?.length ? (
                <div className="text-center py-8 text-slate-400">
                  <Calendar className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                  <p className="text-sm">Aucun échange planifié</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {dashboard.upcomingBookings.slice(0, 5).map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-slate-50"
                    >
                      <div className="w-9 h-9 bg-violet-100 rounded-lg flex items-center justify-center shrink-0">
                        <Clock className="w-4 h-4 text-violet-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 truncate text-sm">
                          {booking.employee?.user?.name}
                        </p>
                        <p className="text-xs text-slate-400 truncate">
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
                      <Badge className="bg-violet-100 text-violet-700 hover:bg-violet-100 text-xs shrink-0">
                        Planifié
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </MedicalDashboardLayout>
  );
}
