"use client";

import { useState, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc-client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ChevronDownIcon, Building2, User, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { InferRouterOutputs } from "@orpc/server";
import type { AppRouter } from "@/server/router";

type Company = InferRouterOutputs<AppRouter>["medical"]["listClientCompanies"][number];

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultDate?: Date;
};

export function CreateBookingDialog({ open, onOpenChange, defaultDate }: Props) {
  const queryClient = useQueryClient();

  const { data: companies = [], isPending: companiesLoading } = useQuery(
    orpc.medical.listClientCompanies.queryOptions({ input: { limit: 100 } })
  );

  const [companyId, setCompanyId] = useState<number | null>(null);
  const [employeeId, setEmployeeId] = useState<number | null>(null);
  const [date, setDate] = useState<Date | undefined>(defaultDate);
  const [time, setTime] = useState("09:00:00");
  const [notes, setNotes] = useState("");
  const [calendarOpen, setCalendarOpen] = useState(false);

  const selectedCompany = useMemo<Company | undefined>(
    () => companies.find((c) => c.id === companyId),
    [companies, companyId]
  );

  const employees = selectedCompany?.employees ?? [];

  function handleCompanyChange(val: string) {
    setCompanyId(Number(val));
    setEmployeeId(null);
  }

  function handleReset() {
    setCompanyId(null);
    setEmployeeId(null);
    setDate(defaultDate);
    setTime("09:00:00");
    setNotes("");
  }

  const createMutation = useMutation({
    ...orpc.booking.create.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orpc.booking.listMedical.key() });
      onOpenChange(false);
      handleReset();
    },
  });

  function handleSubmit() {
    if (!companyId || !employeeId || !date || !time) return;
    const [hours, minutes] = time.split(":").map(Number);
    const scheduledAt = new Date(date);
    scheduledAt.setHours(hours, minutes, 0, 0);
    createMutation.mutate({
      companyId,
      employeeId,
      scheduledAt: scheduledAt.toISOString(),
      notes: notes.trim() || undefined,
    });
  }

  const isValid = !!companyId && !!employeeId && !!date && !!time;

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) handleReset(); }}>
      <DialogContent className="sm:max-w-md p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="text-base font-semibold">
            Nouveau rendez-vous
          </DialogTitle>
          <DialogDescription className="sr-only">
            Créer un nouveau rendez-vous médical
          </DialogDescription>
        </DialogHeader>

        <Separator />

        <div className="px-6 py-5 space-y-5">
          {/* Entreprise */}
          <div className="space-y-1.5">
            <Label className="text-sm flex items-center gap-2 text-muted-foreground">
              <Building2 className="h-3.5 w-3.5" />
              Entreprise
            </Label>
            <Select
              value={companyId ? String(companyId) : ""}
              onValueChange={handleCompanyChange}
              disabled={companiesLoading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionner une entreprise…" />
              </SelectTrigger>
              <SelectContent>
                {companies.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Employé */}
          <div className="space-y-1.5">
            <Label className="text-sm flex items-center gap-2 text-muted-foreground">
              <User className="h-3.5 w-3.5" />
              Employé
            </Label>
            <Select
              value={employeeId ? String(employeeId) : ""}
              onValueChange={(v) => setEmployeeId(Number(v))}
              disabled={!companyId || employees.length === 0}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={
                    !companyId
                      ? "Sélectionnez d'abord une entreprise"
                      : employees.length === 0
                      ? "Aucun employé dans cette entreprise"
                      : "Sélectionner un employé…"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {employees.map((e) => (
                  <SelectItem key={e.id} value={String(e.id)}>
                    {e.user?.name ?? `Employé #${e.id}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date & heure */}
          <FieldGroup className="flex-row items-end">
            <Field>
              <FieldLabel>Date</FieldLabel>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-44 justify-between font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    {date ? format(date, "d MMM yyyy", { locale: fr }) : "Choisir…"}
                    <ChevronDownIcon className="h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 min-w-80 max-w-sm" side="right" align="center">
                  <Calendar
                    mode="single"
                    selected={date}
                    captionLayout="dropdown"
                    defaultMonth={date}
                    disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                    locale={fr}
                    onSelect={(d) => {
                      setDate(d);
                      setCalendarOpen(false);
                    }}
                    className="w-full"
                  />
                </PopoverContent>
              </Popover>
            </Field>

            <Field>
              <FieldLabel htmlFor="booking-time">Heure</FieldLabel>
              <Input
                id="booking-time"
                type="time"
                step="300"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-32 appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              />
            </Field>
          </FieldGroup>

          {/* Notes */}
          <div className="space-y-1.5">
            <Label className="text-sm flex items-center gap-2 text-muted-foreground">
              <FileText className="h-3.5 w-3.5" />
              Notes <span className="text-muted-foreground/60">(optionnel)</span>
            </Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Motif, instructions particulières…"
              className="resize-none text-sm"
              rows={3}
            />
          </div>
        </div>

        <Separator />

        <div className="px-6 py-4 flex gap-2 justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={!isValid || createMutation.isPending}>
            {createMutation.isPending ? "Création…" : "Créer le rendez-vous"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
