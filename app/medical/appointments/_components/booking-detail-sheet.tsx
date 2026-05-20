"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc-client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
import {
  CalendarDays,
  Clock,
  Building2,
  User,
  FileText,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import type { InferRouterOutputs } from "@orpc/server";
import type { AppRouter } from "@/server/router";

type Booking = InferRouterOutputs<AppRouter>["booking"]["list"][number];

const STATUS_CONFIG: Record<
  string,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  pending:   { label: "En attente", variant: "outline" },
  scheduled: { label: "Confirmé",   variant: "default" },
  completed: { label: "Terminé",    variant: "secondary" },
  cancelled: { label: "Annulé",     variant: "destructive" },
};

type Props = {
  booking: Booking | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role?: "company" | "medical";
};

export function BookingDetailSheet({ booking, open, onOpenChange, role = "company" }: Props) {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: orpc.booking.list.key() });
    queryClient.invalidateQueries({ queryKey: orpc.booking.listMedical.key() });
  };

  const cancelMutation = useMutation({
    ...orpc.booking.cancel.mutationOptions(),
    onSuccess: () => { invalidate(); onOpenChange(false); },
  });

  const acceptMutation = useMutation({
    ...orpc.booking.accept.mutationOptions(),
    onSuccess: () => { invalidate(); onOpenChange(false); },
  });

  const updateStatusMutation = useMutation({
    ...orpc.booking.updateStatus.mutationOptions(),
    onSuccess: () => { invalidate(); onOpenChange(false); },
  });

  if (!booking) return null;

  const statusConfig = STATUS_CONFIG[booking.status] ?? STATUS_CONFIG.pending;
  const scheduledDate = new Date(booking.scheduledAt);
  const isPast = scheduledDate < new Date();

  const canAccept       = role === "company" && booking.status === "pending";
  const canCancel       = role === "company" && (booking.status === "pending" || booking.status === "scheduled");
  const canCancelMedical = role === "medical" && (booking.status === "pending" || booking.status === "scheduled");
  const canComplete     = role === "medical" && booking.status === "scheduled" && isPast;

  const hasActions = canAccept || canCancel || canCancelMedical || canComplete;

  const cancelButton = (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
          disabled={cancelMutation.isPending}
        >
          <XCircle className="h-4 w-4 mr-2" />
          Annuler le rendez-vous
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Annuler ce rendez-vous ?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action est irréversible. Le rendez-vous de{" "}
            <strong>{booking.employee?.user?.name}</strong> sera annulé.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Retour</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive hover:bg-destructive/90"
            onClick={() => cancelMutation.mutate({ id: booking.id })}
          >
            Confirmer l&apos;annulation
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <div className="flex items-start justify-between gap-3 pr-6">
            <DialogTitle className="text-base font-semibold leading-tight">
              {booking.employee?.user?.name ?? "Employé inconnu"}
            </DialogTitle>
            <Badge variant={statusConfig.variant} className="shrink-0 mt-0.5">
              {statusConfig.label}
            </Badge>
          </div>
          <DialogDescription className="sr-only">
            Détails du rendez-vous
          </DialogDescription>
        </DialogHeader>

        <Separator />

        <div className="px-6 py-5 space-y-4">
          <div className="space-y-2.5">
            <div className="flex items-center gap-3 text-sm">
              <CalendarDays className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="capitalize">
                {scheduledDate.toLocaleDateString("fr-FR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
              <span>
                {scheduledDate.toLocaleTimeString("fr-FR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>

          <Separator />

          <div className="space-y-2.5">
            {booking.employee?.user && (
              <div className="flex items-center gap-3 text-sm">
                <User className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground">Employé :</span>
                <span className="font-medium">{booking.employee.user.name}</span>
              </div>
            )}
            {booking.medicalCompany && (
              <div className="flex items-center gap-3 text-sm">
                <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground">Organisme :</span>
                <span className="font-medium">{booking.medicalCompany.name}</span>
              </div>
            )}
          </div>

          {booking.notes && (
            <>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4 shrink-0" />
                  <span>Notes</span>
                </div>
                <p className="text-sm leading-relaxed rounded-md bg-muted/50 px-3 py-2.5 text-foreground">
                  {booking.notes}
                </p>
              </div>
            </>
          )}
        </div>

        {hasActions && (
          <>
            <Separator />
            <div className="px-6 py-4 flex flex-col gap-2">
              {canAccept && (
                <Button
                  className="w-full"
                  onClick={() => acceptMutation.mutate({ id: booking.id })}
                  disabled={acceptMutation.isPending}
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Accepter le rendez-vous
                </Button>
              )}
              {canCancel && cancelButton}

              {canComplete && (
                <Button
                  className="w-full"
                  onClick={() => updateStatusMutation.mutate({ id: booking.id, status: "completed" })}
                  disabled={updateStatusMutation.isPending}
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Marquer comme terminé
                </Button>
              )}
              {canCancelMedical && cancelButton}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
