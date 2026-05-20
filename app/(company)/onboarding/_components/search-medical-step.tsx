"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  MapPin,
  Phone,
  Mail,
  Building2,
  X,
  ChevronRight,
  Search,
  MessageSquare,
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { orpc, orpcClient } from "@/lib/orpc-client";
import { verticalFadeIn } from "@/lib/animations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { MedicalCompanyMarker } from "./medical-map";

const MedicalMap = dynamic(
  () => import("./medical-map").then((m) => m.MedicalMap),
  { ssr: false, loading: () => <div className="w-full h-full bg-slate-100 rounded-xl animate-pulse" /> },
);

interface SearchMedicalStepProps {
  onSuccess: () => void;
}

export function SearchMedicalStep({ onSuccess }: SearchMedicalStepProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [radiusKm, setRadiusKm] = useState(30);
  const [selectedCompany, setSelectedCompany] = useState<MedicalCompanyMarker | null>(null);
  const [requestTarget, setRequestTarget] = useState<MedicalCompanyMarker | null>(null);
  const [contactTarget, setContactTarget] = useState<MedicalCompanyMarker | null>(null);
  const [contactMessage, setContactMessage] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  const searchQuery = useQuery(
    orpc.medicalCompany.list.queryOptions({
      input: {
        search: search || undefined,
        postalCode: postalCode || undefined,
        radiusKm,
        limit: 100,
      },
    })
  );

  const sendMessageMutation = useMutation({
    mutationFn: async () => {
      if (!contactTarget) throw new Error("Aucun SPSTI sélectionné");
      return orpcClient.conversation.sendMessage({
        medicalCompanyId: contactTarget.id,
        content: contactMessage.trim() || "Bonjour, je souhaite vous contacter.",
      });
    },
    onSuccess: () => {
      setContactTarget(null);
      setContactMessage("");
      router.push("/messages");
    },
  });

  const createRequestMutation = useMutation({
    mutationFn: async () => {
      if (!requestTarget) throw new Error("Aucune entreprise sélectionnée");
      return orpcClient.membershipRequest.create({
        medicalCompanyId: requestTarget.id,
        message: message || undefined,
      });
    },
    onSuccess: () => {
      setRequestTarget(null);
      onSuccess();
    },
    onError: (err: Error) => {
      setError(err.message);
    },
  });

  const companies = (searchQuery.data ?? []) as MedicalCompanyMarker[];
  const withCoords = companies.filter((c) => c.latitude != null && c.longitude != null);
  const withoutCoords = companies.filter((c) => c.latitude == null || c.longitude == null);

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={verticalFadeIn}
      className="space-y-4"
    >
      {/* Search bar */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Rechercher par nom..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 pl-9"
          />
        </div>
        <div className="w-40">
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

      {/* Map + Sidebar layout */}
      <div className="relative flex gap-4 h-[500px]">
        {/* Map */}
        <div className={`relative transition-all duration-300 ${selectedCompany ? "flex-1" : "w-full"}`}>
          {searchQuery.isPending ? (
            <div className="w-full h-full bg-slate-100 rounded-xl animate-pulse flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
          ) : withCoords.length === 0 ? (
            <div className="w-full h-full bg-slate-100 rounded-xl flex flex-col items-center justify-center text-slate-500 gap-3">
              <Building2 className="w-12 h-12 text-slate-300" />
              <p className="text-sm">
                {companies.length === 0
                  ? "Aucun service de santé trouvé"
                  : `${withoutCoords.length} service(s) sans localisation`}
              </p>
            </div>
          ) : (
            <MedicalMap
              companies={withCoords}
              selectedId={selectedCompany?.id ?? null}
              onSelect={setSelectedCompany}
            />
          )}
        </div>

        {/* Sidebar */}
        {selectedCompany && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="w-80 bg-white border border-slate-200 rounded-xl shadow-lg flex flex-col overflow-hidden"
          >
            <div className="flex items-start justify-between p-4 border-b border-slate-100">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-900 text-sm leading-tight truncate">
                  {selectedCompany.name}
                </h3>
                {selectedCompany.city && (
                  <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3 shrink-0" />
                    {selectedCompany.postalCode} {selectedCompany.city}
                  </p>
                )}
              </div>
              <button
                onClick={() => setSelectedCompany(null)}
                className="ml-2 p-1 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {selectedCompany.description && (
                <p className="text-xs text-slate-600 leading-relaxed">
                  {selectedCompany.description}
                </p>
              )}
              {selectedCompany.address && (
                <div className="flex items-start gap-2 text-xs text-slate-600">
                  <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-slate-400" />
                  <span>{selectedCompany.address}</span>
                </div>
              )}
              {selectedCompany.phone && (
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Phone className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                  <a href={`tel:${selectedCompany.phone}`} className="hover:text-blue-600 transition-colors">
                    {selectedCompany.phone}
                  </a>
                </div>
              )}
              {selectedCompany.email && (
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Mail className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                  <a href={`mailto:${selectedCompany.email}`} className="hover:text-blue-600 transition-colors truncate">
                    {selectedCompany.email}
                  </a>
                </div>
              )}
              {selectedCompany.sectors && (
                <div className="pt-1">
                  <p className="text-xs font-medium text-slate-700 mb-1.5">Secteurs couverts</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedCompany.sectors.split(",").map((s) => (
                      <span
                        key={s}
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-700 border border-blue-100"
                      >
                        {s.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 space-y-2">
              <Button
                variant="outline"
                className="w-full text-sm h-9 gap-2"
                onClick={() => setContactTarget(selectedCompany)}
              >
                <MessageSquare className="w-4 h-4" />
                Contacter
              </Button>
              <Button
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-sm h-9"
                onClick={() => setRequestTarget(selectedCompany)}
              >
                Envoyer une demande
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </motion.div>
        )}
      </div>

      {/* SPSTIs sans coordonnées */}
      {withoutCoords.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-slate-500 font-medium">
            {withoutCoords.length} service(s) sans localisation géographique
          </p>
          {withoutCoords.map((company) => (
            <div
              key={company.id}
              className="p-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all cursor-pointer flex items-center justify-between"
              onClick={() => setRequestTarget(company)}
            >
              <div>
                <p className="text-sm font-medium text-slate-900">{company.name}</p>
                {company.city && (
                  <p className="text-xs text-slate-500">{company.postalCode} {company.city}</p>
                )}
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          ))}
        </div>
      )}

      {/* Dialog contacter */}
      <Dialog open={!!contactTarget} onOpenChange={() => { setContactTarget(null); setContactMessage(""); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contacter {contactTarget?.name}</DialogTitle>
            <DialogDescription>
              Envoyez un message pour initier la conversation
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="contact-message">Message</Label>
              <Textarea
                id="contact-message"
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                placeholder="Bonjour, je souhaite vous contacter..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setContactTarget(null); setContactMessage(""); }}>
              Annuler
            </Button>
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

      {/* Dialog demande */}
      <Dialog open={!!requestTarget} onOpenChange={() => setRequestTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Demander à rejoindre</DialogTitle>
            <DialogDescription>
              Envoyez une demande d&apos;adhésion à {requestTarget?.name}
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
            <Button variant="outline" onClick={() => setRequestTarget(null)}>
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
