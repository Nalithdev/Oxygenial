"use client";

import {useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import Link from "next/link";
import {motion} from "motion/react";
import {signUp} from "@/lib/auth-client";
import {verticalFadeIn} from "@/lib/animations";
import {
    AuthSeparator,
    EmailInput,
    FormError,
    MobileLogo,
    NameInput,
    PasswordInput,
    SubmitButton,
    TermsText,
} from "../../_components";
import {validatePasswords} from "../../_hooks/use-password-validation";
import {orpcClient} from "@/lib/orpc-client";

export function SignUpContent() {
    const invitation = useSearchParams().get("invitation") || undefined;
    console.log(invitation)
    const router = useRouter();
    const searchParams = useSearchParams();
    let redirectTo = searchParams.get("redirect") || "/welcome";
    const signInHref = redirectTo !== "/welcome"
        ? `/sign-in?redirect=${encodeURIComponent(redirectTo)}`
        : "/sign-in";

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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

        const {error} = await signUp.email({
            email,
            password,
            name,
            callbackURL: redirectTo,
        });

        if (error) {
            setError(
                error.message || "Une erreur est survenue lors de l'inscription"
            );
            setIsLoading(false);
            return;
        }

        if (!invitation) {
            router.push(redirectTo);
            return;
        }

        try {
            await orpcClient.clientCompany.join({
                token: invitation,
            });

            router.push("/dashboard");
        } catch (err) {
            console.error("Erreur lors de l'ajout à l'entreprise", err);
        }

    }


    return (
        <motion.div
            initial="initial"
            animate="animate"
            transition={{staggerChildren: 0.05}}
            className="space-y-8"
        >
            <motion.div
                variants={verticalFadeIn}
                className="space-y-2 text-center lg:text-left"
            >
                <MobileLogo/>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                    Créer votre compte
                </h1>
                <p className="text-slate-600">
                    Commencez à gérer votre santé au travail en quelques minutes
                </p>
            </motion.div>

            <motion.form
                variants={verticalFadeIn}
                onSubmit={handleSubmit}
                className="space-y-5"
            >
                {error && <FormError message={error}/>}

                <NameInput value={name} onChange={setName}/>
                <EmailInput value={email} onChange={setEmail}/>

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
                    Créer mon compte
                </SubmitButton>

                <TermsText/>
            </motion.form>

            <AuthSeparator/>

            <motion.div variants={verticalFadeIn} className="text-center">
                <p className="text-slate-600">
                    Déjà un compte ?{" "}
                    <Link
                        href={signInHref}
                        className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                    >
                        Se connecter
                    </Link>
                </p>
            </motion.div>
        </motion.div>
    );
}

