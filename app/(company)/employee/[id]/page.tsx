"use client";

import {useEffect} from "react";
import {useParams, useRouter} from "next/navigation";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {motion} from "motion/react";
import {ArrowLeft, Calendar, Clock, FileText, Mail, Plus, Trash2,} from "lucide-react";
import Link from "next/link";
import {orpc, orpcClient} from "@/lib/orpc-client";
import {verticalFadeIn} from "@/lib/animations";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Badge} from "@/components/ui/badge";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {DashboardLayout} from "../../dashboard/_components/dashboard-layout";
import {useSession} from "@/lib/auth-client";

export default function EmployeeDetailPage() {
    const params = useParams();
    const router = useRouter();
    const employeeId = parseInt(params.id as string);
    const {data: session} = useSession();

    const userId = session?.user?.id;

    const employeeQuery = useQuery(
        orpc.employee.get.queryOptions({
            input: {id: employeeId},
        })
    );

    const currentUserEmployeeQuery = useQuery(
        orpc.employee.get_by_userId.queryOptions({
            input: {id: userId!},
        })
    );
    useEffect(() => {
        if (!currentUserEmployeeQuery.data || !employeeQuery.data) return;

        const current = currentUserEmployeeQuery.data;
        const viewed = employeeQuery.data;

        const isAdmin = current.position === "Administrateur";
        const isManager = current.position === "Manager";

        const isSelf = current.id === viewed.id;

        const isViewedEmployee = viewed.position === null;

        let canAccess = false;

        if (isAdmin) {
            // admin voit tout
            canAccess = true;
        }

        if (isManager) {
            canAccess = isSelf || isViewedEmployee;
            console.log(canAccess)
        }

        if (!isAdmin && !isManager) {
            canAccess = isSelf;
        }

        if (!canAccess) {
            router.push("/employee");
        }
    }, [currentUserEmployeeQuery.data, employeeQuery.data, router]);

    

    const deleteEmployeeMutation = useMutation({
        mutationFn: async () => {
            return orpcClient.employee.delete({id: employeeId});
        },
        onSuccess: () => {
            router.push("/employee");
        },
    });

    const employee = employeeQuery.data;

    if (employeeQuery.isPending) {
        return (
            <DashboardLayout>
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"/>
                </div>
            </DashboardLayout>
        );
    }

    if (!employee) {
        return (
            <DashboardLayout>
                <div className="text-center py-12">
                    <p className="text-slate-500">Employé non trouvé</p>
                    <Link href="/employee">
                        <Button variant="link">Retour à la liste</Button>
                    </Link>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <motion.div
                initial="initial"
                animate="animate"
                transition={{staggerChildren: 0.1}}
                className="space-y-6"
            >
                <motion.div variants={verticalFadeIn}>
                    <Link href="/employee">
                        <Button variant="ghost" size="sm" className="mb-4">
                            <ArrowLeft className="w-4 h-4 mr-2"/>
                            Retour
                        </Button>
                    </Link>

                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <div
                                className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-2xl font-medium">
                                {employee.user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">
                                    {employee.user?.name}
                                </h1>
                                <div className="flex items-center gap-3 mt-1">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Mail className="w-4 h-4"/>
                      {employee.user?.email}
                  </span>
                                    <Badge variant="outline">
                                        {employee.role === "company_admin" ? "Admin" : "Employé"}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            

                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="outline" size="icon" className="text-red-600 hover:text-red-700">
                                        <Trash2 className="w-4 h-4"/>
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Supprimer l&apos;employé ?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Cette action est irréversible. L&apos;employé sera retiré de votre
                                            entreprise.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={() => deleteEmployeeMutation.mutate()}
                                            className="bg-red-600 hover:bg-red-700"
                                        >
                                            Supprimer
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>
                </motion.div>

                <motion.div variants={verticalFadeIn}>
                    <Tabs defaultValue="bookings">
                        <TabsList>
                            <TabsTrigger value="bookings" className="gap-2">
                                <Calendar className="w-4 h-4"/>
                                Rendez-vous
                            </TabsTrigger>
                            <TabsTrigger value="documents" className="gap-2">
                                <FileText className="w-4 h-4"/>
                                Documents
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="bookings" className="mt-4">
                            <Card className="border-slate-200">
                                <CardHeader>
                                    <CardTitle className="text-lg">Historique des rendez-vous</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {employee.bookings?.length === 0 ? (
                                        <div className="text-center py-8 text-slate-500">
                                            <Calendar className="w-10 h-10 mx-auto mb-2 text-slate-300"/>
                                            <p>Aucun rendez-vous</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {employee.bookings?.map((booking) => (
                                                <div
                                                    key={booking.id}
                                                    className="flex items-center gap-3 p-4 rounded-lg bg-slate-50 border border-slate-100"
                                                >
                                                    <div
                                                        className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-slate-200">
                                                        <Clock className="w-5 h-5 text-slate-400"/>
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
                                                            {booking.notes && ` • ${booking.notes}`}
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
                                    {employee.documents?.length === 0 ? (
                                        <div className="text-center py-8 text-slate-500">
                                            <FileText className="w-10 h-10 mx-auto mb-2 text-slate-300"/>
                                            <p>Aucun document</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {employee.documents?.map((doc) => (
                                                <a
                                                    key={doc.id}
                                                    href={doc.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-3 p-4 rounded-lg bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors"
                                                >
                                                    <div
                                                        className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                        <FileText className="w-5 h-5 text-blue-600"/>
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
        </DashboardLayout>
    );
}

