"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  FileText,
  Pencil,
  Check,
  X,
  Shield,
} from "lucide-react";
import { orpc, orpcClient } from "@/lib/orpc-client";
import { verticalFadeIn } from "@/lib/animations";
import { MedicalDashboardLayout } from "../_components/medical-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function MedicalProfilPage() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data, isPending } = useQuery(
    orpc.medicalCompany.getMine.queryOptions({})
  );

  const [form, setForm] = useState({
    name: "",
    description: "",
    address: "",
    postalCode: "",
    city: "",
    phone: "",
    email: "",
    website: "",
    sectors: "",
    coveragePostalCodes: "",
  });

  useEffect(() => {
    if (data?.company) {
      setForm({
        name: data.company.name ?? "",
        description: data.company.description ?? "",
        address: data.company.address ?? "",
        postalCode: data.company.postalCode ?? "",
        city: data.company.city ?? "",
        phone: data.company.phone ?? "",
        email: data.company.email ?? "",
        website: data.company.website ?? "",
        sectors: data.company.sectors ?? "",
        coveragePostalCodes: data.company.coveragePostalCodes ?? "",
      });
    }
  }, [data]);

  const updateMutation = useMutation({
    mutationFn: () => orpcClient.medicalCompany.update(form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orpc.medicalCompany.getMine.key() });
      setEditing(false);
      setError(null);
    },
    onError: (err: Error) => {
      setError(err.message);
    },
  });

  const handleCancel = () => {
    if (data?.company) {
      setForm({
        name: data.company.name ?? "",
        description: data.company.description ?? "",
        address: data.company.address ?? "",
        postalCode: data.company.postalCode ?? "",
        city: data.company.city ?? "",
        phone: data.company.phone ?? "",
        email: data.company.email ?? "",
        website: data.company.website ?? "",
        sectors: data.company.sectors ?? "",
        coveragePostalCodes: data.company.coveragePostalCodes ?? "",
      });
    }
    setEditing(false);
    setError(null);
  };

  if (isPending) {
    return (
      <MedicalDashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
        </div>
      </MedicalDashboardLayout>
    );
  }

  const isAdmin = data?.role === "admin";

  return (
    <MedicalDashboardLayout>
      <motion.div {...verticalFadeIn} className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Mon SPSTI</h1>
            <p className="text-slate-500 mt-1">Gérez la présence de votre service sur la plateforme</p>
          </div>
          {isAdmin && !editing && (
            <Button onClick={() => setEditing(true)} variant="outline" className="gap-2">
              <Pencil className="w-4 h-4" />
              Modifier
            </Button>
          )}
          {editing && (
            <div className="flex gap-2">
              <Button variant="ghost" onClick={handleCancel} className="gap-2">
                <X className="w-4 h-4" />
                Annuler
              </Button>
              <Button
                onClick={() => updateMutation.mutate()}
                disabled={updateMutation.isPending}
                className="gap-2 bg-emerald-600 hover:bg-emerald-700"
              >
                <Check className="w-4 h-4" />
                {updateMutation.isPending ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
            {error}
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Building2 className="w-4 h-4 text-emerald-600" />
              Informations générales
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="gap-1">
                <Shield className="w-3 h-3" />
                {data?.role === "admin" ? "Administrateur" : data?.role}
              </Badge>
            </div>

            <div className="space-y-2">
              <Label>Nom du service</Label>
              {editing ? (
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Nom du SPSTI"
                />
              ) : (
                <p className="text-slate-900 font-medium">{data?.company.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              {editing ? (
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Décrivez votre service..."
                  rows={3}
                />
              ) : (
                <p className="text-slate-600">{data?.company.description || <span className="text-slate-400 italic">Non renseigné</span>}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Secteurs d'activité</Label>
              {editing ? (
                <Input
                  value={form.sectors}
                  onChange={(e) => setForm({ ...form, sectors: e.target.value })}
                  placeholder="BTP, industrie, tertiaire..."
                />
              ) : (
                <p className="text-slate-600">{data?.company.sectors || <span className="text-slate-400 italic">Non renseigné</span>}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <MapPin className="w-4 h-4 text-emerald-600" />
              Adresse & couverture
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Adresse</Label>
              {editing ? (
                <Input
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="12 rue de la Santé"
                />
              ) : (
                <p className="text-slate-600">{data?.company.address || <span className="text-slate-400 italic">Non renseigné</span>}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Code postal</Label>
                {editing ? (
                  <Input
                    value={form.postalCode}
                    onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                    placeholder="75000"
                  />
                ) : (
                  <p className="text-slate-600">{data?.company.postalCode || <span className="text-slate-400 italic">Non renseigné</span>}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Ville</Label>
                {editing ? (
                  <Input
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    placeholder="Paris"
                  />
                ) : (
                  <p className="text-slate-600">{data?.company.city || <span className="text-slate-400 italic">Non renseigné</span>}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Codes postaux couverts</Label>
              {editing ? (
                <Textarea
                  value={form.coveragePostalCodes}
                  onChange={(e) => setForm({ ...form, coveragePostalCodes: e.target.value })}
                  placeholder="75001, 75002, 92000..."
                  rows={2}
                />
              ) : (
                <p className="text-slate-600">{data?.company.coveragePostalCodes || <span className="text-slate-400 italic">Non renseigné</span>}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="w-4 h-4 text-emerald-600" />
              Contact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-1"><Phone className="w-3 h-3" /> Téléphone</Label>
              {editing ? (
                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="01 23 45 67 89"
                />
              ) : (
                <p className="text-slate-600">{data?.company.phone || <span className="text-slate-400 italic">Non renseigné</span>}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-1"><Mail className="w-3 h-3" /> Email</Label>
              {editing ? (
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="contact@spsti.fr"
                />
              ) : (
                <p className="text-slate-600">{data?.company.email || <span className="text-slate-400 italic">Non renseigné</span>}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-1"><Globe className="w-3 h-3" /> Site web</Label>
              {editing ? (
                <Input
                  value={form.website}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
                  placeholder="https://www.spsti.fr"
                />
              ) : (
                <p className="text-slate-600">
                  {data?.company.website
                    ? <a href={data.company.website} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">{data.company.website}</a>
                    : <span className="text-slate-400 italic">Non renseigné</span>
                  }
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </MedicalDashboardLayout>
  );
}
