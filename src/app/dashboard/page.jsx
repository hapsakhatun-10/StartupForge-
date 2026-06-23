"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import Loader from "@/components/shared/Loader";

export default function DashboardRedirect() {
    const router = useRouter();
    const { data: session, isPending } = useSession();

    useEffect(() => {
        if (isPending) return;
        if (!session?.user) {
            router.replace("/login");
            return;
        }
        const role = session.user.role;
        if (role === "founder") router.replace("/dashboard/founder");
        else if (role === "collaborator") router.replace("/dashboard/collaborator");
        else if (role === "admin") router.replace("/dashboard/admin");
        else router.replace("/login");
    }, [session, isPending, router]);

    return <Loader text="Redirecting to your dashboard..." />;
}
