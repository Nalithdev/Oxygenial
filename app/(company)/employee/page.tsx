"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import { Users, Plus, Search, Mail, Briefcase } from "lucide-react";
import Link from "next/link";
import { orpc, orpcClient } from "@/lib/orpc-client";
import { verticalFadeIn } from "@/lib/animations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DashboardLayout } from "../dashboard/_components/dashboard-layout";
import {useSession} from "@/lib/auth-client";

export default function EmployeesPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const { data: session } = useSession();

    const userId = session?.user?.id;
  const [newEmployee, setNewEmployee] = useState({
    email: "",
    position: "",
    role: "employee" as "employee" | "company_admin",
  });
  const [error, setError] = useState<string | null>(null);

  const employeesQuery = useQuery(
    orpc.employee.list.queryOptions({
      input: { limit: 100 },
    })
  );

  const createEmployeeMutation = useMutation({
    mutationFn: async () => {
      return orpcClient.employee.create({
        email: newEmployee.email,
        position: newEmployee.position || undefined,
        role: newEmployee.role,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      setIsAddDialogOpen(false);
      setNewEmployee({ email: "", position: "", role: "employee" });
      setError(null);
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

    const currentUserEmployeeQuery = useQuery(
        orpc.employee.get_by_userId.queryOptions({
            input: { id: userId! },
            enabled: !!userId,
        })
    );

  const filteredEmployees = employeesQuery.data?.filter((employee) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      employee.user?.name?.toLowerCase().includes(searchLower) ||
      employee.user?.email?.toLowerCase().includes(searchLower) ||
      employee.position?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <DashboardLayout>
      <motion.div
        initial="initial"
        animate="animate"
        transition={{ staggerChildren: 0.1 }}
        className="space-y-6"
      >
        <motion.div variants={verticalFadeIn} className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Employés</h1>
            <p className="text-slate-600 mt-1">
              Gérez les employés de votre entreprise
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un employé
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter un employé</DialogTitle>
                <DialogDescription>
                  L&apos;employé doit avoir un compte Oxygenial pour être ajouté
                </DialogDescription>
              </DialogHeader>

              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Adresse email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newEmployee.email}
                    onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                    placeholder="employee@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="position">Poste</Label>
                  <Input
                    id="position"
                    value={newEmployee.position}
                    onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
                    placeholder="Développeur, Commercial..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Rôle</Label>
                  <Select
                    value={newEmployee.role}
                    onValueChange={(value: "employee" | "company_admin") =>
                      setNewEmployee({ ...newEmployee, role: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="employee">Employé</SelectItem>
                      <SelectItem value="company_admin">Administrateur</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Annuler
                </Button>
                <Button
                  onClick={() => createEmployeeMutation.mutate()}
                  disabled={createEmployeeMutation.isPending || !newEmployee.email}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600"
                >
                  {createEmployeeMutation.isPending ? "Ajout..." : "Ajouter"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </motion.div>

        <motion.div variants={verticalFadeIn}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Rechercher un employé..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </motion.div>

        <motion.div variants={verticalFadeIn}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredEmployees?.map((employee) => {
                    const isAdmin = currentUserEmployeeQuery.data?.role === "company_admin";
                    const isClickable = isAdmin;

                    const content = (
                        <Card className="border-slate-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer h-full">
                            <CardContent className="pt-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-lg font-medium shrink-0">
                                        {employee.user?.name?.charAt(0).toUpperCase()}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold text-slate-900 truncate">
                                                {employee.user?.name}
                                            </h3>

                                            <Badge variant="outline" className="shrink-0">
                                                {employee.role === "company_admin"
                                                    ? "Administrateur"
                                                    : "Employé"}
                                            </Badge>
                                        </div>

                                        <div className="mt-2 space-y-1">
                                            <p className="text-sm text-slate-500 flex items-center gap-1.5 truncate">
                                                <Mail className="w-3.5 h-3.5" />
                                                {employee.user?.email}
                                            </p>

                                            {employee.position && (
                                                <p className="text-sm text-slate-500 flex items-center gap-1.5">
                                                    <Briefcase className="w-3.5 h-3.5" />
                                                    {employee.position}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );

                    return isClickable ? (
                        <Link
                            key={employee.id}
                            href={`/employee/${employee.id}`}
                        >
                            {content}
                        </Link>
                    ) : (
                        <div key={employee.id}>
                            {content}
                        </div>
                    );
                })}
            </div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}

