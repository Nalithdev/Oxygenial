import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { orpc } from "@/lib/orpc-client";
import { useEffect } from "react";

export function useOnboarding() {

    const router = useRouter();
    const queryClient = useQueryClient();

    const statusQuery = useQuery(
        orpc.onboarding.getStatus.queryOptions({})
    );

    useEffect(() => {
        if (statusQuery.data) {
            if (statusQuery.data.type === "medical_staff") {
                router.push("/medical");
                return;
            }

            if (statusQuery.data.onboardingStatus === "completed") {
                router.push("/dashboard");
                return;
            }
        }
    }, [statusQuery.data, router]);

    return {
        statusQuery,
        queryClient
    }
}