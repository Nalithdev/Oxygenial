"use client";

import { motion } from "motion/react";
import { Building2 } from "lucide-react";
import { verticalFadeIn } from "@/lib/animations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useCompanyDetails } from "../../hooks/useCompanyDetails";

const SECTORS = [
  "Agriculture",
  "Artisanat",
  "BTP",
  "Commerce",
  "Industrie",
  "Restauration",
  "Santé",
  "Services",
  "Transport",
  "Autre",
];

interface CompanyDetailsStepProps {
  onSuccess: () => void;
}

export function CompanyDetailsStep({ onSuccess }: CompanyDetailsStepProps) {

  const { handleSubmit, error, formData, setFormData, createCompanyMutation } = useCompanyDetails(onSuccess);

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={verticalFadeIn}
    >
      <Card className="border-slate-200 shadow-lg">
        <CardHeader className="text-center pb-2">
          <div className="w-14 h-14 mx-auto mb-4 bg-blue-100 rounded-2xl flex items-center justify-center">
            <Building2 className="w-7 h-7 text-blue-600" />
          </div>
          <CardTitle className="text-xl">Informations de votre entreprise</CardTitle>
          <CardDescription>
            Renseignez les détails de votre entreprise pour trouver le service de santé adapté
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Nom de l&apos;entreprise *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ma Société SAS"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="siret">SIRET *</Label>
              <Input
                id="siret"
                value={formData.siret}
                onChange={(e) => setFormData({ ...formData, siret: e.target.value })}
                placeholder="12345678901234"
                maxLength={14}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="postalCode">Code postal *</Label>
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
                <Label htmlFor="city">Ville *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Paris"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Adresse *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="123 rue de la Paix"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sector">Secteur d&apos;activité *</Label>
                <Select
                  value={formData.sector}
                  onValueChange={(value) => setFormData({ ...formData, sector: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    {SECTORS.map((sector) => (
                      <SelectItem key={sector} value={sector}>
                        {sector}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="employeeCount">Nombre d&apos;employés *</Label>
                <Input
                  id="employeeCount"
                  type="number"
                  value={formData.employeeCount}
                  onChange={(e) => setFormData({ ...formData, employeeCount: e.target.value })}
                  placeholder="10"
                  min={1}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              disabled={createCompanyMutation.isPending}
            >
              {createCompanyMutation.isPending ? "Création en cours..." : "Continuer"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

