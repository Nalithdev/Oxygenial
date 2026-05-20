"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion } from "motion/react";
import { Stethoscope, Building2, MapPin, Phone, Mail, Globe, FileText } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { orpc, orpcClient } from "@/lib/orpc-client";
import { verticalFadeIn } from "@/lib/animations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function MedicalRegisterPage() {
  const router = useRouter();
  const { data: session, isPending: sessionPending } = useSession();

  const [formData, setFormData] = useState({
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
  const [error, setError] = useState<string | null>(null);

  const statusQuery = useQuery(
    orpc.onboarding.getStatus.queryOptions({})
  );

  const createMutation = useMutation({
    mutationFn: async () => {
      return orpcClient.medicalCompany.create({
        name: formData.name,
        description: formData.description || undefined,
        address: formData.address || undefined,
        postalCode: formData.postalCode || undefined,
        city: formData.city || undefined,
        phone: formData.phone || undefined,
        email: formData.email || undefined,
        website: formData.website || undefined,
        sectors: formData.sectors || undefined,
        coveragePostalCodes: formData.coveragePostalCodes || undefined,
      });
    },
    onSuccess: () => {
      router.push("/medical");
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  useEffect(() => {
    if (!sessionPending && !session) {
      router.push("/sign-up?redirect=/medical/register");
    }
  }, [session, sessionPending, router]);

  useEffect(() => {
    if (statusQuery.data) {
      if (statusQuery.data.type === "medical_staff") {
        router.push("/medical");
        return;
      }
      if (statusQuery.data.type === "employee") {
        router.push("/dashboard");
        return;
      }
    }
  }, [statusQuery.data, router]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError("Le nom de votre service est requis");
      return;
    }

    createMutation.mutate();
  }

  if (sessionPending || statusQuery.isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/40">
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <motion.div
          initial="initial"
          animate="animate"
          transition={{ staggerChildren: 0.1 }}
          className="space-y-8"
        >
          <motion.div variants={verticalFadeIn} className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center">
              <Stethoscope className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Enregistrez votre service de santé
            </h1>
            <p className="text-slate-600">
              Créez votre espace professionnel sur Medli'
            </p>
          </motion.div>

          <motion.div variants={verticalFadeIn}>
            <Card className="border-slate-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-emerald-600" />
                  Informations du service
                </CardTitle>
                <CardDescription>
                  Ces informations seront visibles par les entreprises recherchant un service de santé
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                      {error}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="name">Nom du service *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Santé Plus Île-de-France"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">
                      <FileText className="w-4 h-4 inline mr-1" />
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Présentez votre service de santé au travail..."
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">
                        <MapPin className="w-4 h-4 inline mr-1" />
                        Code postal *
                      </Label>
                      <Input
                        id="postalCode"
                        value={formData.postalCode}
                        onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                        placeholder="75001"
                        maxLength={10}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">Ville</Label>
                      <Input
                        id="city *"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder="Paris"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Adresse complète *</Label>
                    <Input
                      id="address *"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="15 rue de la Santé"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">
                        <Phone className="w-4 h-4 inline mr-1" />
                        Téléphone *
                      </Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="01 23 45 67 89"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">
                        <Mail className="w-4 h-4 inline mr-1" />
                        Email de contact *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="contact@example.fr"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">
                      <Globe className="w-4 h-4 inline mr-1" />
                      Site web
                    </Label>
                    <Input
                      id="website"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      placeholder="https://www.example.fr"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sectors">Secteurs couverts *</Label>
                    <Input
                      id="sectors"
                      value={formData.sectors}
                      onChange={(e) => setFormData({ ...formData, sectors: e.target.value })}
                      placeholder="BTP, Industrie, Commerce, Services..."
                      required
                    />
                    <p className="text-xs text-slate-500">Séparez les secteurs par des virgules</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="coveragePostalCodes">Codes postaux couverts *</Label>
                    <Input
                      id="coveragePostalCodes"
                      value={formData.coveragePostalCodes}
                      onChange={(e) => setFormData({ ...formData, coveragePostalCodes: e.target.value })}
                      placeholder="75, 77, 78, 91, 92, 93, 94, 95..."
                      required
                    />
                    <p className="text-xs text-slate-500">Indiquez les départements ou codes postaux couverts</p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 text-base font-semibold rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                    disabled={createMutation.isPending}
                  >
                    {createMutation.isPending ? "Création en cours..." : "Créer mon espace professionnel"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={verticalFadeIn} className="text-center text-sm text-slate-500">
            <p>
              Vous êtes une entreprise cherchant un service de santé ?{" "}
              <a href="/onboarding" className="text-emerald-600 hover:text-emerald-700 font-medium">
                Inscrivez votre entreprise
              </a>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

