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
  Stethoscope,
  Pencil,
  Check,
  X,
  Shield,
  Plus,
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

const PREDEFINED_SERVICES = [
  "Visite d'information et de prévention (VIP)",
  "Visite médicale périodique",
  "Visite de reprise",
  "Visite à la demande",
  "Actions en milieu de travail (AMT)",
  "Étude de poste",
  "Formation premiers secours",
  "Accompagnement RPS",
  "Suivi individuel renforcé (SIR)",
  "Bilan de santé au travail",
];

function parseList(text: string): string[] {
  return text
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function serializeList(arr: string[]): string {
  return arr.join(", ");
}

function TagInput({
  tags,
  onChange,
  placeholder,
  suggestions,
}: {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  suggestions?: string[];
}) {
  const [input, setInput] = useState("");

  const addTag = (value: string) => {
    const trimmed = value.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInput("");
  };

  const removeTag = (tag: string) => {
    onChange(tags.filter((t) => t !== tag));
  };

  const availableSuggestions = suggestions?.filter((s) => !tags.includes(s));

  return (
    <div className="space-y-3">
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="gap-1 pr-1">
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-1 rounded-full hover:bg-slate-300 p-0.5 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTag(input);
            }
          }}
          className="flex-1"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addTag(input)}
          disabled={!input.trim()}
          className="gap-1 shrink-0"
        >
          <Plus className="w-3 h-3" />
          Ajouter
        </Button>
      </div>
      {availableSuggestions && availableSuggestions.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs text-slate-500">Suggestions :</p>
          <div className="flex flex-wrap gap-1.5">
            {availableSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => addTag(suggestion)}
                className="text-xs px-2.5 py-1 rounded-full border border-dashed border-emerald-300 text-emerald-700 hover:bg-emerald-50 transition-colors"
              >
                + {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function MedicalProfilPage() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data, isPending, isError } = useQuery(
    orpc.medicalCompany.getMy.queryOptions({})
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
  });

  const [servicesList, setServicesList] = useState<string[]>([]);
  const [coverageList, setCoverageList] = useState<string[]>([]);

  useEffect(() => {
    if (data?.company) {
      const c = data.company;
      setForm({
        name: c.name ?? "",
        description: c.description ?? "",
        address: c.address ?? "",
        postalCode: c.postalCode ?? "",
        city: c.city ?? "",
        phone: c.phone ?? "",
        email: c.email ?? "",
        website: c.website ?? "",
        sectors: c.sectors ?? "",
      });
      setServicesList(parseList((c as any).services ?? ""));
      setCoverageList(parseList(c.coveragePostalCodes ?? ""));
    }
  }, [data]);

  const updateMutation = useMutation({
    mutationFn: () =>
      orpcClient.medicalCompany.update({
        ...form,
        services: serializeList(servicesList),
        coveragePostalCodes: serializeList(coverageList),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: orpc.medicalCompany.getMy.key(),
      });
      setEditing(false);
      setError(null);
    },
    onError: (err: Error) => {
      setError(err.message);
    },
  });

  const handleCancel = () => {
    if (data?.company) {
      const c = data.company;
      setForm({
        name: c.name ?? "",
        description: c.description ?? "",
        address: c.address ?? "",
        postalCode: c.postalCode ?? "",
        city: c.city ?? "",
        phone: c.phone ?? "",
        email: c.email ?? "",
        website: c.website ?? "",
        sectors: c.sectors ?? "",
      });
      setServicesList(parseList((c as any).services ?? ""));
      setCoverageList(parseList(c.coveragePostalCodes ?? ""));
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

  if (isError) {
    return (
      <MedicalDashboardLayout>
        <div className="flex items-center justify-center h-64 text-slate-500">
          <p>Impossible de charger les informations du SPSTI.</p>
        </div>
      </MedicalDashboardLayout>
    );
  }

  const isAdmin = data?.role === "admin";
  const company = data?.company;

  return (
    <MedicalDashboardLayout>
      <motion.div {...verticalFadeIn} className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Mon SPSTI</h1>
            <p className="text-slate-500 mt-1">
              Gérez la présence de votre service sur la plateforme
            </p>
          </div>
          {isAdmin && !editing && (
            <Button
              onClick={() => setEditing(true)}
              variant="outline"
              className="gap-2"
            >
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

        {/* Informations générales */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Building2 className="w-4 h-4 text-emerald-600" />
              Informations générales
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Badge variant="secondary" className="gap-1">
              <Shield className="w-3 h-3" />
              {data?.role === "admin" ? "Administrateur" : data?.role}
            </Badge>

            <div className="space-y-2">
              <Label>Nom du service</Label>
              {editing ? (
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Nom du SPSTI"
                />
              ) : (
                <p className="text-slate-900 font-medium">{company?.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              {editing ? (
                <Textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Décrivez votre service..."
                  rows={3}
                />
              ) : (
                <p className="text-slate-600">
                  {company?.description || (
                    <span className="text-slate-400 italic">Non renseigné</span>
                  )}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Secteurs d&apos;activité couverts</Label>
              {editing ? (
                <Input
                  value={form.sectors}
                  onChange={(e) =>
                    setForm({ ...form, sectors: e.target.value })
                  }
                  placeholder="BTP, industrie, tertiaire..."
                />
              ) : company?.sectors ? (
                <div className="flex flex-wrap gap-1.5">
                  {parseList(company.sectors).map((s) => (
                    <Badge key={s} variant="outline" className="text-xs">
                      {s}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 italic text-sm">Non renseigné</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Services proposés */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Stethoscope className="w-4 h-4 text-emerald-600" />
              Services proposés
            </CardTitle>
          </CardHeader>
          <CardContent>
            {editing ? (
              <TagInput
                tags={servicesList}
                onChange={setServicesList}
                placeholder="Ex : Visite de reprise..."
                suggestions={PREDEFINED_SERVICES}
              />
            ) : servicesList.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {servicesList.map((service) => (
                  <Badge
                    key={service}
                    className="bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-50"
                  >
                    {service}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 italic text-sm">
                Aucun service renseigné
              </p>
            )}
          </CardContent>
        </Card>

        {/* Coordonnées */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Phone className="w-4 h-4 text-emerald-600" />
              Coordonnées
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5">
                <Phone className="w-3 h-3" /> Téléphone
              </Label>
              {editing ? (
                <Input
                  value={form.phone}
                  onChange={(e) =>
                    setForm({ ...form, phone: e.target.value })
                  }
                  placeholder="01 23 45 67 89"
                />
              ) : (
                <p className="text-slate-600">
                  {company?.phone || (
                    <span className="text-slate-400 italic">Non renseigné</span>
                  )}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-1.5">
                <Mail className="w-3 h-3" /> Email
              </Label>
              {editing ? (
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  placeholder="contact@spsti.fr"
                />
              ) : (
                <p className="text-slate-600">
                  {company?.email || (
                    <span className="text-slate-400 italic">Non renseigné</span>
                  )}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-1.5">
                <Globe className="w-3 h-3" /> Site web
              </Label>
              {editing ? (
                <Input
                  value={form.website}
                  onChange={(e) =>
                    setForm({ ...form, website: e.target.value })
                  }
                  placeholder="https://www.spsti.fr"
                />
              ) : (
                <p className="text-slate-600">
                  {company?.website ? (
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-600 hover:underline"
                    >
                      {company.website}
                    </a>
                  ) : (
                    <span className="text-slate-400 italic">Non renseigné</span>
                  )}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Zones d'intervention */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <MapPin className="w-4 h-4 text-emerald-600" />
              Zones d&apos;intervention
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Adresse du siège</Label>
              {editing ? (
                <Input
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                  placeholder="12 rue de la Santé"
                />
              ) : (
                <p className="text-slate-600">
                  {company?.address || (
                    <span className="text-slate-400 italic">Non renseigné</span>
                  )}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Code postal</Label>
                {editing ? (
                  <Input
                    value={form.postalCode}
                    onChange={(e) =>
                      setForm({ ...form, postalCode: e.target.value })
                    }
                    placeholder="75000"
                  />
                ) : (
                  <p className="text-slate-600">
                    {company?.postalCode || (
                      <span className="text-slate-400 italic">
                        Non renseigné
                      </span>
                    )}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Ville</Label>
                {editing ? (
                  <Input
                    value={form.city}
                    onChange={(e) =>
                      setForm({ ...form, city: e.target.value })
                    }
                    placeholder="Paris"
                  />
                ) : (
                  <p className="text-slate-600">
                    {company?.city || (
                      <span className="text-slate-400 italic">Non renseigné</span>
                    )}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Codes postaux couverts</Label>
              <p className="text-xs text-slate-500">
                Renseignez les codes postaux des zones que vous couvrez
              </p>
              {editing ? (
                <TagInput
                  tags={coverageList}
                  onChange={setCoverageList}
                  placeholder="Ex : 75001"
                />
              ) : coverageList.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {coverageList.map((cp) => (
                    <Badge key={cp} variant="outline" className="text-xs font-mono">
                      {cp}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 italic text-sm">
                  Aucune zone renseignée
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </MedicalDashboardLayout>
  );
}
