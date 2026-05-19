"use client";

import { MedicalDashboardLayout } from "../_components/medical-layout";
import { useSession } from "@/lib/auth-client";


export default function Profil() {

    const { data: session } = useSession()

    return (
        <MedicalDashboardLayout>
            <div className="relative">
                <p>{`Name : ${session?.user.name}`}</p>
            </div>
            <div className="relative">
                <p>{`Email : ${session?.user.email}`}</p>
            </div>
            <div className="relative">
                <p>{`Email vérifié : ${session?.user.emailVerified ? 'Oui' : 'Non'}`}</p>
            </div>
        </MedicalDashboardLayout>
    )
}