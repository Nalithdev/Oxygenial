"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import { Building2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signUp } from "@/lib/auth-client";
import { verticalFadeIn } from "@/lib/animations";
import {
  MobileLogo,
  FormError,
  EmailInput,
  NameInput,
  PasswordInput,
  SubmitButton,
  TermsText,
} from "../../_components";
import { validatePasswords } from "../../_hooks/use-password-validation";

export function InviteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const inviteToken = searchParams.get("token");
  const inviteEmail = searchParams.get("email");
  const companyName = searchParams.get("company");

  const [name, setName] = useState("");
  const [email, setEmail] = useState(inviteEmail || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const effectiveEmail = inviteEmail || email;

  const isValidInvite = inviteToken && inviteEmail;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const validation = validatePasswords(password, confirmPassword);
    if (!validation.isValid) {
      setError(validation.error);
      setIsLoading(false);
      return;
    }

    const { error } = await signUp.email({
      email: effectiveEmail,
      password,
      name,
      callbackURL: "/dashboard",
    });

    if (error) {
      setError(
        error.message || "Une erreur est survenue lors de l'inscription"
      );
      setIsLoading(false);
      return;
    }

    router.push("/dashboard");
  }

  if (!isValidInvite) {
    return (
      <motion.div
        initial="initial"
        animate="animate"
        transition={{ staggerChildren: 0.05 }}
        className="space-y-8"
      >
        <motion.div variants={verticalFadeIn} className="space-y-4 text-center">
          <div className="w-16 h-16 mx-auto bg-amber-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-amber-600" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Invitation invalide
          </h1>
          <p className="text-slate-600">
            Ce lien d&apos;invitation est invalide ou a expiré. Contactez votre
            administrateur pour recevoir une nouvelle invitation.
          </p>
        </motion.div>

        <motion.div variants={verticalFadeIn} className="space-y-4">
          <Link href="/sign-in">
            <Button
              variant="outline"
              className="w-full h-12 text-base font-medium rounded-xl bg-white/50 backdrop-blur-sm hover:bg-white/80 border-slate-200"
            >
              Se connecter avec un compte existant
            </Button>
          </Link>
          <Link href="/">
            <Button
              variant="ghost"
              className="w-full h-12 text-base font-medium rounded-xl"
            >
              Retour à l&apos;accueil
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="initial"
      animate="animate"
      transition={{ staggerChildren: 0.05 }}
      className="space-y-8"
    >
      <motion.div
        variants={verticalFadeIn}
        className="space-y-2 text-center lg:text-left"
      >
        <MobileLogo />
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Bienvenue dans l&apos;équipe !
        </h1>
        <p className="text-slate-600">
          Vous avez été invité à rejoindre Medli'
        </p>
      </motion.div>

      {companyName && (
        <motion.div
          variants={verticalFadeIn}
          className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Vous rejoignez</p>
              <p className="font-semibold text-slate-900">{companyName}</p>
            </div>
          </div>
        </motion.div>
      )}

      <motion.form
        variants={verticalFadeIn}
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        {error && <FormError message={error} />}

        <NameInput value={name} onChange={setName} />

        <EmailInput
          value={effectiveEmail}
          onChange={setEmail}
          disabled={!!inviteEmail}
          hint={
            inviteEmail ? "Cette adresse est liée à votre invitation" : undefined
          }
        />

        <PasswordInput
          id="password"
          label="Mot de passe"
          value={password}
          onChange={setPassword}
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword(!showPassword)}
          hint="Au moins 8 caractères"
        />

        <PasswordInput
          id="confirmPassword"
          label="Confirmer le mot de passe"
          value={confirmPassword}
          onChange={setConfirmPassword}
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword(!showPassword)}
          showToggle={false}
        />

        <SubmitButton isLoading={isLoading} loadingText="Création en cours...">
          Rejoindre l&apos;équipe
        </SubmitButton>

        <TermsText />
      </motion.form>

      <motion.div variants={verticalFadeIn} className="text-center">
        <p className="text-slate-600">
          Déjà un compte ?{" "}
          <Link
            href="/sign-in"
            className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            Se connecter
          </Link>
        </p>
      </motion.div>
    </motion.div>
  );
}

