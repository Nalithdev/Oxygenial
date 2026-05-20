"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import {
  LayoutDashboard,
  Building2,
  Inbox,
  MessageSquare,
  LogOut,
  Menu,
  X,
  Stethoscope,
  UserCog,
} from "lucide-react";
import { signOut, useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navigation = [
  { name: "Tableau de bord", href: "/medical", icon: LayoutDashboard },
  { name: "Demandes", href: "/medical/requests", icon: Inbox },
  { name: "Entreprises", href: "/medical/company", icon: Building2 },
  { name: "Mon SPSTI", href: "/medical/profil", icon: UserCog },
  { name: "Messages", href: "/medical/messages", icon: MessageSquare },
  { name: "Rendez-vous", href: "/medical/appointments", icon: Stethoscope },
];

interface MedicalLayoutProps {
  children: React.ReactNode;
}

export function MedicalDashboardLayout({ children }: MedicalLayoutProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/medical" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center">
                  <Stethoscope className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-slate-900">Oxygenial</span>
                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                  Médical
                </span>
              </Link>

              <div className="hidden md:flex items-center gap-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href ||
                    (item.href !== "/medical" && pathname.startsWith(item.href));
                  return (
                    <Link key={item.name} href={item.href}>
                      <Button
                        variant={isActive ? "secondary" : "ghost"}
                        size="sm"
                        className="gap-2"
                      >
                        <item.icon className="w-4 h-4" />
                        {item.name}
                      </Button>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <div className="w-7 h-7 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {session?.user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden sm:inline">{session?.user?.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5 text-sm">
                    <p className="font-medium">{session?.user?.name}</p>
                    <p className="text-slate-500 truncate">{session?.user?.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <Link href={'/profil'}>
                    <DropdownMenuItem
                      className="cursor-pointer"
                    >
                      Profil
                    </DropdownMenuItem>
                  </Link>

                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => signOut({ fetchOptions: { onSuccess: () => { window.location.href = "/"; } } })}
                    className="text-red-600 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Se déconnecter
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden border-t border-slate-200 bg-white"
          >
            <div className="container mx-auto px-4 py-3 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href ||
                  (item.href !== "/medical" && pathname.startsWith(item.href));
                return (
                  <Link key={item.name} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className="w-full justify-start gap-2"
                    >
                      <item.icon className="w-4 h-4" />
                      {item.name}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </nav>

      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}

