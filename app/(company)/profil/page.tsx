"use client";

import { useSession } from "@/lib/auth-client";
import { DashboardLayout } from "../dashboard/_components/dashboard-layout";


export default function Profil() {

    const { data: session } = useSession()

    return (
        <DashboardLayout>
            <div className="relative">
                <p>{`Name : ${session?.user.name}`}</p>
            </div>
            <div className="relative">
                <p>{`Email : ${session?.user.email}`}</p>
            </div>
            <div className="relative">
                <p>{`Email vérifié : ${session?.user.emailVerified ? 'Oui' : 'Non'}`}</p>
            </div>
        </DashboardLayout>
    )
}