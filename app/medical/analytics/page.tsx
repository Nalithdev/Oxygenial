"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { TrendingUp, FileText, CheckCircle, Clock, XCircle, Building2, MapPin } from "lucide-react";
import { orpc } from "@/lib/orpc-client";
import { verticalFadeIn } from "@/lib/animations";
import { MedicalDashboardLayout } from "../_components/medical-layout";

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        <p className="text-sm text-slate-500">{label}</p>
      </div>
    </div>
  );
}

function BarChart({ data, color }: { data: { name: string; count: number }[]; color: string }) {
  const max = Math.max(...data.map((d) => d.count), 1);
  return (
    <div className="space-y-3">
      {data.map((item) => (
        <div key={item.name}>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-700 truncate max-w-[70%]">{item.name}</span>
            <span className="font-semibold text-slate-900">{item.count}</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${color}`}
              style={{ width: `${(item.count / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AnalyticsPage() {
  const analyticsQuery = useQuery(orpc.medicalCompany.getAnalytics.queryOptions({}));

  const data = analyticsQuery.data;

  return (
    <MedicalDashboardLayout>
      <motion.div {...verticalFadeIn} className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Analytiques</h1>
          <p className="text-slate-500 text-sm mt-1">Vue d'ensemble de l'activité de votre SPSTI</p>
        </div>

        {analyticsQuery.isPending ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
          </div>
        ) : !data ? null : (
          <>
            {/* KPI cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                icon={FileText}
                label="Demandes reçues"
                value={data.total}
                color="bg-slate-100 text-slate-600"
              />
              <StatCard
                icon={CheckCircle}
                label="Acceptées"
                value={data.accepted}
                color="bg-emerald-50 text-emerald-600"
              />
              <StatCard
                icon={Clock}
                label="En attente"
                value={data.pending}
                color="bg-amber-50 text-amber-600"
              />
              <StatCard
                icon={XCircle}
                label="Rejetées"
                value={data.rejected}
                color="bg-red-50 text-red-500"
              />
            </div>

            {/* Conversion rate */}
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  <h2 className="font-semibold text-slate-900">Taux de conversion</h2>
                </div>
                <span className="text-3xl font-bold text-emerald-600">{data.conversionRate}%</span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-emerald-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${data.conversionRate}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
              <p className="text-xs text-slate-400 mt-2">
                {data.accepted} acceptée{data.accepted > 1 ? "s" : ""} sur {data.total} demande{data.total > 1 ? "s" : ""}
              </p>
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-5">
                  <Building2 className="w-4 h-4 text-slate-500" />
                  <h2 className="font-semibold text-slate-900">Secteurs les plus représentés</h2>
                </div>
                {data.topSectors.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-4">Aucune donnée</p>
                ) : (
                  <BarChart data={data.topSectors} color="bg-blue-500" />
                )}
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-5">
                  <MapPin className="w-4 h-4 text-slate-500" />
                  <h2 className="font-semibold text-slate-900">Zones géographiques les plus actives</h2>
                </div>
                {data.topCities.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-4">Aucune donnée</p>
                ) : (
                  <BarChart data={data.topCities} color="bg-emerald-500" />
                )}
              </div>
            </div>
          </>
        )}
      </motion.div>
    </MedicalDashboardLayout>
  );
}
