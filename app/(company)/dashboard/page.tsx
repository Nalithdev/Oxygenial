"use client";

import { Key, useEffect, useState  } from "react";
import {  useRouter  } from "next/navigation";
import {  useQuery, useMutation, useQueryClient  } from "@tanstack/react-query";
import {  motion  } from "motion/react";
import {  Calendar, Users, Building2, Clock, ChevronRight, Plus, Copy, Check, MessageSquare  } from "lucide-react";
import Link from "next/link";
import { orpc, orpcClient } from "@/lib/orpc-client";
import { verticalFadeIn } from "@/lib/animations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Textarea} from "@/components/ui/textarea";
import {Label} from "@/components/ui/label";
import { DashboardLayout } from "./_components/dashboard-layout";
import { BookingDetailSheet } from "../appointments/_components/booking-detail-sheet";
import { useSession } from "@/lib/auth-client";
import type { InferRouterOutputs } from "@orpc/server";
import type { AppRouter } from "@/server/router";

type Booking = InferRouterOutputs<AppRouter>["booking"]["list"][number];

export default function DashboardPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  const userId = session?.user?.id;
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
    const [showContactDialog, setShowContactDialog] = useState(false);
    const [contactMessage, setContactMessage] = useState("");

  const statusQuery = useQuery(orpc.onboarding.getStatus.queryOptions({}));
  const bookingsQuery = useQuery(
    orpc.booking.list.queryOptions({ input: { upcoming: true, limit: 100 } })
  );
  const employeesQuery = useQuery(
    orpc.employee.list.queryOptions({ input: { limit: 10 } })
  );
  const currentUserEmployeeQuery = useQuery(
    orpc.employee.get_by_userId.queryOptions({
      input: { id: userId! },
      enabled: !!userId,
    })
  );
  const invitationsQuery = useQuery(
    orpc.invitationCompany.list.queryOptions({
      input: { companyId: statusQuery.data?.clientCompany?.id ?? 0 },
    })
  );

  const isAdmin = currentUserEmployeeQuery.data?.role === "company_admin";

  const createInvitationMutation = useMutation(
    orpc.invitationCompany.createInvitation.mutationOptions({
      onSuccess: () => {
        const companyId = statusQuery.data?.clientCompany?.id;
        if (!companyId) return;
        queryClient.invalidateQueries(
          orpc.invitationCompany.list.queryOptions({ input: { companyId } })
        );
      },
      onError: (error) => console.error("Erreur création invitation:", error),
    })
  );

    const sendMessageMutation = useMutation({
        mutationFn: async () => {
            const medicalCompanyId = statusQuery.data?.clientCompany?.medicalCompany?.id;
            if (!medicalCompanyId) throw new Error("Aucun SPSTI associé");
            return orpcClient.conversation.sendMessage({
                medicalCompanyId,
                content: contactMessage.trim() || "Bonjour, je souhaite vous contacter.",
            });
        },
        onSuccess: () => {
            setShowContactDialog(false);
            setContactMessage("");
            router.push("/messages");
        },
    });

  const copyToClipboard = (token: string | null) => {
    const url = `${window.location.origin}/sign-up?invitation=${token}`;
    navigator.clipboard.writeText(url);
    setCopiedId(token);
    setTimeout(() => setCopiedId(null), 2000);
  };

  function openBooking(booking: Booking) {
    setSelectedBooking(booking);
    setSheetOpen(true);
  }

  useEffect(() => {
    if (statusQuery.data) {
      if (statusQuery.data.type === "medical_staff") { router.push("/medical"); return; }
      if (statusQuery.data.type === "none" || statusQuery.data.onboardingStatus !== "completed") {
        router.push("/onboarding"); return;
      }
    }
  }, [statusQuery.data, router]);

  if (statusQuery.isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  const company = statusQuery.data?.clientCompany;
  const medicalCompany = company?.medicalCompany;
  const confirmedBookings = bookingsQuery.data?.filter((b) => b.status === "scheduled") ?? [];
  const pendingBookings = bookingsQuery.data?.filter((b) => b.status === "pending") ?? [];

  return (
    <DashboardLayout>
      <motion.div
        initial="initial"
        animate="animate"
        transition={{ staggerChildren: 0.1 }}
        className="space-y-8"
      >
        <motion.div variants={verticalFadeIn}>
          <h1 className="text-2xl font-bold text-slate-900">Bonjour 👋</h1>
          <p className="text-slate-600 mt-1">Bienvenue sur votre tableau de bord</p>
        </motion.div>

        {/* Stats */}
        <motion.div variants={verticalFadeIn} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-slate-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{employeesQuery.data?.length ?? 0}</p>
                  <p className="text-sm text-slate-500">Employés</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{confirmedBookings.length}</p>
                  <p className="text-sm text-slate-500">RDV à venir</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-violet-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-900 truncate">{medicalCompany?.name ?? "—"}</p>
                  <p className="text-sm text-slate-500">Service de santé</p>
                </div>
                                {medicalCompany && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-1.5 shrink-0"
                                        onClick={() => setShowContactDialog(true)}
                                    >
                                        <MessageSquare className="w-3.5 h-3.5" />
                                        Contacter
                                    </Button>
                                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Bookings row — equal height */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* À confirmer */}
          <motion.div variants={verticalFadeIn} className="flex flex-col">
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
          </motion.div>

          {/* Confirmés */}
          <motion.div variants={verticalFadeIn} className="flex flex-col">
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
              {!confirmedBookings.length ? (
                <div className="flex flex-col items-center justify-center h-full py-8 text-slate-400">
                  <Calendar className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                  <p className="text-sm">Aucun rendez-vous planifié</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {confirmedBookings.slice(0, 5).map((booking) => (
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
        </div>

        {/* Employés + Invitations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div variants={verticalFadeIn}>
            <Card className="border-slate-200">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Employés</CardTitle>
                <Link href="/employee">
                  <Button variant="ghost" size="sm">
                    Gérer <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {employeesQuery.isPending ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
                  </div>
                ) : !employeesQuery.data?.length ? (
                  <div className="text-center py-8 text-slate-500">
                    <Users className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                    <p>Aucun employé</p>
                    <Link href="/employee">
                      <Button variant="link" className="mt-2">
                        <Plus className="w-4 h-4 mr-1" /> Ajouter un employé
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {employeesQuery.data?.slice(0, 5).map((employee) => {
                      const content = (
                        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {employee.user?.name?.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-slate-900 truncate">{employee.user?.name}</p>
                            <p className="text-sm text-slate-500 truncate">{employee.position ?? "Employé"}</p>
                          </div>
                          <Badge variant="outline" className="shrink-0">
                            {employee.role === "company_admin" ? "Admin" : "Employé"}
                          </Badge>
                        </div>
                      );
                      return isAdmin ? (
                        <Link key={employee.id} href={`/employee/${employee.id}`}>{content}</Link>
                      ) : (
                        <div key={employee.id}>{content}</div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {currentUserEmployeeQuery.data?.position === "Administrateur" && (
            <motion.div variants={verticalFadeIn}>
              <Card className="border-slate-200">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Invitations</CardTitle>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() =>
                      createInvitationMutation.mutate({
                        companyId: statusQuery.data?.clientCompany?.id,
                      })
                    }
                    disabled={createInvitationMutation.isPending}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    {createInvitationMutation.isPending ? "Génération..." : "Générer une invitation"}
                  </Button>
                </CardHeader>
                <CardContent>
                  {invitationsQuery.isPending ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
                    </div>
                  ) : !invitationsQuery.data?.length ? (
                    <div className="text-center py-8 text-slate-500">
                      <p>Aucune invitation générée</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {invitationsQuery.data?.map((invitation: { id: Key | null | undefined; token: string | null }) => (
                        <div key={invitation.id} className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate-900">Lien d&apos;invitation</p>
                              <p className="text-xs text-slate-500 mt-1 truncate">
                                {`${window.location.origin}/sign-up?invitation=${invitation.token}`}
                              </p>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => copyToClipboard(invitation.token)}>
                              {copiedId === invitation.token ? (
                                <Check className="w-4 h-4" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </motion.div>

        <Dialog open={showContactDialog} onOpenChange={(open) => { setShowContactDialog(open); if (!open) setContactMessage(""); }}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Contacter {medicalCompany?.name}</DialogTitle>
                    <DialogDescription>Envoyez un message pour initier la conversation</DialogDescription>
                </DialogHeader>
                <div className="space-y-2 py-4">
                    <Label htmlFor="contact-msg">Message</Label>
                    <Textarea
                        id="contact-msg"
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        placeholder="Bonjour, je souhaite vous contacter..."
                        rows={4}
                    />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setShowContactDialog(false)}>Annuler</Button>
                    <Button
                        onClick={() => sendMessageMutation.mutate()}
                        disabled={sendMessageMutation.isPending}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        {sendMessageMutation.isPending ? "Envoi..." : "Envoyer"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

      <BookingDetailSheet
        booking={selectedBooking}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        role="company"
      />
    </DashboardLayout>
  );
}
