"use client";

import { Key, useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {motion} from "motion/react";
import {Calendar, Users, Building2, Clock, ChevronRight, Plus, Copy, Check} from "lucide-react";
import Link from "next/link";
import {orpc} from "@/lib/orpc-client";
import {verticalFadeIn} from "@/lib/animations";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {DashboardLayout} from "./_components/dashboard-layout";
import {useSession} from "@/lib/auth-client";

export default function DashboardPage() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { data: session } = useSession();

    const userId = session?.user?.id;
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const statusQuery = useQuery(
        orpc.onboarding.getStatus.queryOptions({})
    );

    const bookingsQuery = useQuery(
        orpc.booking.list.queryOptions({
            input: {upcoming: true, limit: 5},
        })
    );

    const employeesQuery = useQuery(
        orpc.employee.list.queryOptions({
            input: {limit: 10},
        })
    );

    const currentUserEmployeeQuery = useQuery(
        orpc.employee.get_by_userId.queryOptions({
            input: { id: userId! },
            enabled: !!userId,
        })
    );
    const invitationsQuery = useQuery(
        orpc.invitationCompany.list.queryOptions({
            input: { companyId: statusQuery.data?.clientCompany?.id ?? 0 }
        })
    );

    const isAdmin = currentUserEmployeeQuery.data?.role === "company_admin";

    const createInvitationMutation = useMutation(
        orpc.invitationCompany.createInvitation.mutationOptions({
            onSuccess: () => {
                const companyId = statusQuery.data?.clientCompany?.id;

                if (!companyId) return;

                queryClient.invalidateQueries(
                    orpc.invitationCompany.list.queryOptions({
                        input: { companyId },
                    })
                );
            },
            onError: (error) => {
                console.error("Erreur création invitation:", error);
            },
        })
    );

    const copyToClipboard = (token: string | null) => {
        const url = `${window.location.origin}/sign-up?invitation=${token}`;
        navigator.clipboard.writeText(url);
        setCopiedId(token);
        setTimeout(() => setCopiedId(null), 2000);
    };

    useEffect(() => {
        if (statusQuery.data) {
            console.log("Onboarding status:", statusQuery.data);
            if (statusQuery.data.type === "medical_staff") {
                router.push("/medical");
                return;
            }
            if (statusQuery.data.type === "none" || statusQuery.data.onboardingStatus !== "completed") {
                router.push("/onboarding");
                return;
            }
        }
    }, [statusQuery.data, router]);

    if (statusQuery.isPending) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"/>
            </div>
        );
    }

    const company = statusQuery.data?.clientCompany;
    const medicalCompany = company?.medicalCompany

    return (
        <DashboardLayout>
            <motion.div
                initial="initial"
                animate="animate"
                transition={{staggerChildren: 0.1}}
                className="space-y-8"
            >
                <motion.div variants={verticalFadeIn}>
                    <h1 className="text-2xl font-bold text-slate-900">
                        Bonjour 👋
                    </h1>
                    <p className="text-slate-600 mt-1">
                        Bienvenue sur votre tableau de bord
                    </p>
                </motion.div>

                <motion.div variants={verticalFadeIn} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="border-slate-200">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                    <Users className="w-6 h-6 text-blue-600"/>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-slate-900">
                                        {employeesQuery.data?.length ?? 0}
                                    </p>
                                    <p className="text-sm text-slate-500">Employés</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                                    <Calendar className="w-6 h-6 text-emerald-600"/>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-slate-900">
                                        {bookingsQuery.data?.length ?? 0}
                                    </p>
                                    <p className="text-sm text-slate-500">RDV à venir</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center">
                                    <Building2 className="w-6 h-6 text-violet-600"/>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-semibold text-slate-900 truncate">
                                        {medicalCompany?.name ?? "—"}
                                    </p>
                                    <p className="text-sm text-slate-500">Service de santé</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <motion.div variants={verticalFadeIn}>
                        <Card className="border-slate-200">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="text-lg">Prochains rendez-vous</CardTitle>
                                <Link href="/employee">
                                    <Button variant="ghost" size="sm">
                                        Voir tout
                                        <ChevronRight className="w-4 h-4 ml-1"/>
                                    </Button>
                                </Link>
                            </CardHeader>
                            <CardContent>
                                {bookingsQuery.isPending ? (
                                    <div className="flex justify-center py-8">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"/>
                                    </div>
                                ) : bookingsQuery.data?.length === 0 ? (
                                    <div className="text-center py-8 text-slate-500">
                                        <Calendar className="w-10 h-10 mx-auto mb-2 text-slate-300"/>
                                        <p>Aucun rendez-vous à venir</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {bookingsQuery.data?.map((booking) => (
                                            <div
                                                key={booking.id}
                                                className="flex items-center gap-3 p-3 rounded-lg bg-slate-50"
                                            >
                                                <div
                                                    className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-slate-200">
                                                    <Clock className="w-5 h-5 text-slate-400"/>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-slate-900 truncate">
                                                        {booking.employee?.user?.name}
                                                    </p>
                                                    <p className="text-sm text-slate-500">
                                                        {new Date(booking.scheduledAt).toLocaleDateString("fr-FR", {
                                                            weekday: "short",
                                                            day: "numeric",
                                                            month: "short",
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        })}
                                                    </p>
                                                </div>
                                                <Badge variant="secondary" className="shrink-0">
                                                    {booking.status === "scheduled" ? "Planifié" : booking.status}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div variants={verticalFadeIn}>
                        <Card className="border-slate-200">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="text-lg">Employés</CardTitle>
                                <Link href="/employee">
                                    <Button variant="ghost" size="sm">
                                        Gérer
                                        <ChevronRight className="w-4 h-4 ml-1"/>
                                    </Button>
                                </Link>
                            </CardHeader>
                            <CardContent>
                                {employeesQuery.isPending ? (
                                    <div className="flex justify-center py-8">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"/>
                                    </div>
                                ) : employeesQuery.data?.length === 0 ? (
                                    <div className="text-center py-8 text-slate-500">
                                        <Users className="w-10 h-10 mx-auto mb-2 text-slate-300"/>
                                        <p>Aucun employé</p>
                                        <Link href="/employee">
                                            <Button variant="link" className="mt-2">
                                                <Plus className="w-4 h-4 mr-1"/>
                                                Ajouter un employé
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
                                                        <p className="font-medium text-slate-900 truncate">
                                                            {employee.user?.name}
                                                        </p>
                                                        <p className="text-sm text-slate-500 truncate">
                                                            {employee.position ?? "Employé"}
                                                        </p>
                                                    </div>

                                                    <Badge variant="outline" className="shrink-0">
                                                        {employee.role === "company_admin" ? "Admin" : "Employé"}
                                                    </Badge>
                                                </div>
                                            );

                                            return isAdmin ? (
                                                <Link key={employee.id} href={`/employee/${employee.id}`}>
                                                    {content}
                                                </Link>
                                            ) : (
                                                <div key={employee.id}>{content}</div>
                                            );
                                        })}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
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
                                <Plus className="w-4 h-4 mr-1"/>
                                {createInvitationMutation.isPending ? "Génération..." : "Générer une invitation"}
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {invitationsQuery.isPending ? (
                                <div className="flex justify-center py-8">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"/>
                                </div>
                            ) : invitationsQuery.data?.length === 0 ? (
                                <div className="text-center py-8 text-slate-500">
                                    <p>Aucune invitation générée</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {invitationsQuery.data?.map((invitation: { id: Key | null | undefined; token: string | null; }) => (
                                        <div
                                            key={invitation.id}
                                            className="p-4 rounded-lg bg-slate-50 border border-slate-200"
                                        >
                                            <div className="flex items-center justify-between gap-3">
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-slate-900">
                                                        Lien d&apos;invitation
                                                    </p>
                                                    <p className="text-xs text-slate-500 mt-1 truncate">
                                                        {`${window.location.origin}/sign-up?invitation=${invitation.token}`}
                                                    </p>
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => copyToClipboard(invitation.token)}
                                                >
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
            </motion.div>

        </DashboardLayout>
    );
}
