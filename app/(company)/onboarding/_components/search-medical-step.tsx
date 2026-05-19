"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion } from "motion/react";
import { Search, MapPin, Phone, Mail, Building2, ChevronRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { orpc, orpcClient } from "@/lib/orpc-client";
import { verticalFadeIn } from "@/lib/animations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface SearchMedicalStepProps {
  onSuccess: () => void;
}

export function SearchMedicalStep({ onSuccess }: SearchMedicalStepProps) {
  const [search, setSearch] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [radiusKm, setRadiusKm] = useState(30);
  const [selectedCompany, setSelectedCompany] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  const searchQuery = useQuery(
    orpc.medicalCompany.list.queryOptions({
      input: {
        search: search || undefined,
        postalCode: postalCode || undefined,
        radiusKm,
        limit: 20,
      },
    })
  );

  const createRequestMutation = useMutation({
    mutationFn: async () => {
      if (!selectedCompany) throw new Error("Aucune entreprise sélectionnée");
      return orpcClient.membershipRequest.create({
        medicalCompanyId: selectedCompany.id,
        message: message || undefined,
      });
    },
    onSuccess: () => {
      setSelectedCompany(null);
      onSuccess();
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={verticalFadeIn}
      className="space-y-6"
    >
      <Card className="border-slate-200 shadow-lg">
        <CardHeader className="text-center pb-2">
          <div className="w-14 h-14 mx-auto mb-4 bg-emerald-100 rounded-2xl flex items-center justify-center">
            <Search className="w-7 h-7 text-emerald-600" />
          </div>
          <CardTitle className="text-xl">Trouvez votre service de santé</CardTitle>
          <CardDescription>
            Recherchez un service de santé au travail adapté à votre entreprise
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Rechercher par nom..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-11"
              />
            </div>
            <div className="w-36">
              <Input
                placeholder="Code postal"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                maxLength={5}
                className="h-11"
              />
            </div>
            {postalCode.length === 5 && (
              <div className="w-32">
                <Select
                  value={String(radiusKm)}
                  onValueChange={(v) => setRadiusKm(Number(v))}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 km</SelectItem>
                    <SelectItem value="30">30 km</SelectItem>
                    <SelectItem value="50">50 km</SelectItem>
                    <SelectItem value="100">100 km</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {searchQuery.isPending ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
          ) : searchQuery.data?.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Building2 className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p>Aucun service de santé trouvé</p>
              <p className="text-sm mt-1">Essayez d&apos;élargir votre recherche</p>
            </div>
          ) : (
            <div className="space-y-3">
              {searchQuery.data?.map((company) => (
                <div
                  key={company.id}
                  className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all cursor-pointer group"
                  onClick={() => setSelectedCompany({ id: company.id, name: company.name })}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                        {company.name}
                      </h3>
                      {company.description && (
                        <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                          {company.description}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-3 mt-3 text-sm text-slate-500">
                        {company.city && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {company.postalCode} {company.city}
                          </span>
                        )}
                        {company.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5" />
                            {company.phone}
                          </span>
                        )}
                        {company.email && (
                          <span className="flex items-center gap-1">
                            <Mail className="w-3.5 h-3.5" />
                            {company.email}
                          </span>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors mt-1" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedCompany} onOpenChange={() => setSelectedCompany(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Demander à rejoindre</DialogTitle>
            <DialogDescription>
              Envoyez une demande d&apos;adhésion à {selectedCompany?.name}
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="message">Message (optionnel)</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Présentez votre entreprise et vos besoins..."
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedCompany(null)}>
              Annuler
            </Button>
            <Button
              onClick={() => createRequestMutation.mutate()}
              disabled={createRequestMutation.isPending}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              {createRequestMutation.isPending ? "Envoi en cours..." : "Envoyer la demande"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

