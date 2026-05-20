"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import {
  Building2,
  Mail,
  Calendar,
  FileText,
  Clock,
  LogOut,
  Stethoscope,
} from "lucide-react";
import Link from "next/link";
import { signOut, useSession } from "@/lib/auth-client";
import { orpc } from "@/lib/orpc-client";
import { verticalFadeIn } from "@/lib/animations";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function EmployeePersonalPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const profileQuery = useQuery(
    orpc.employee.getMyProfile.queryOptions({})
  );

  const statusQuery = useQuery(
    orpc.onboarding.getStatus.queryOptions({})
  );

  useEffect(() => {
    if (statusQuery.data) {
      if (statusQuery.data.type === "none") {
        router.push("/onboarding");
        return;
      }
      if (statusQuery.data.type === "medical_staff") {
        router.push("/medical");
        return;
      }
    }
  }, [statusQuery.data, router]);

  if (profileQuery.isPending || statusQuery.isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  const profile = profileQuery.data;

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/me" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-slate-900">Medli'</span>
            </Link>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut({ fetchOptions: { onSuccess: () => { window.location.href = "/"; } } })}
              className="text-red-600"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial="initial"
          animate="animate"
          transition={{ staggerChildren: 0.1 }}
          className="space-y-6"
        >
          <motion.div variants={verticalFadeIn}>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-2xl font-medium">
                {session?.user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  {session?.user?.name}
                </h1>
                <p className="text-slate-500 flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  {session?.user?.email}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={verticalFadeIn} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-slate-200">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-slate-500">Entreprise</p>
                    <p className="font-semibold text-slate-900 truncate">
                      {profile?.clientCompany?.name}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <Stethoscope className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-slate-500">Service de santé</p>
                    <p className="font-semibold text-slate-900 truncate">
                      {profile?.clientCompany?.medicalCompany?.name ?? "—"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={verticalFadeIn}>
            <Tabs defaultValue="bookings">
              <TabsList>
                <TabsTrigger value="bookings" className="gap-2">
                  <Calendar className="w-4 h-4" />
                  Mes rendez-vous
                </TabsTrigger>
                <TabsTrigger value="documents" className="gap-2">
                  <FileText className="w-4 h-4" />
                  Mes documents
                </TabsTrigger>
              </TabsList>

              <TabsContent value="bookings" className="mt-4">
                <Card className="border-slate-200">
                  <CardHeader>
                    <CardTitle className="text-lg">Historique des rendez-vous</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {profile?.bookings?.length === 0 ? (
                      <div className="text-center py-8 text-slate-500">
                        <Calendar className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                        <p>Aucun rendez-vous</p>
                        <p className="text-sm mt-1">
                          Votre administrateur peut planifier des rendez-vous pour vous
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {profile?.bookings?.map((booking) => (
                          <div
                            key={booking.id}
                            className="flex items-center gap-3 p-4 rounded-lg bg-slate-50 border border-slate-100"
                          >
                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-slate-200">
                              <Clock className="w-5 h-5 text-slate-400" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-slate-900">
                                {new Date(booking.scheduledAt).toLocaleDateString("fr-FR", {
                                  weekday: "long",
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                })}
                              </p>
                              <p className="text-sm text-slate-500">
                                {new Date(booking.scheduledAt).toLocaleTimeString("fr-FR", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                                {" • "}
                                {booking.medicalCompany?.name}
                              </p>
                            </div>
                            <Badge
                              variant={
                                booking.status === "completed"
                                  ? "default"
                                  : booking.status === "cancelled"
                                  ? "destructive"
                                  : "secondary"
                              }
                            >
                              {booking.status === "scheduled"
                                ? "Planifié"
                                : booking.status === "completed"
                                ? "Terminé"
                                : "Annulé"}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="documents" className="mt-4">
                <Card className="border-slate-200">
                  <CardHeader>
                    <CardTitle className="text-lg">Documents médicaux</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {profile?.documents?.length === 0 ? (
                      <div className="text-center py-8 text-slate-500">
                        <FileText className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                        <p>Aucun document</p>
                        <p className="text-sm mt-1">
                          Vos documents médicaux apparaîtront ici
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {profile?.documents?.map((doc) => (
                          <a
                            key={doc.id}
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-4 rounded-lg bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors"
                          >
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <FileText className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-slate-900">{doc.name}</p>
                              <p className="text-sm text-slate-500">
                                {doc.type && `${doc.type} • `}
                                {new Date(doc.createdAt).toLocaleDateString("fr-FR")}
                              </p>
                            </div>
                          </a>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}

