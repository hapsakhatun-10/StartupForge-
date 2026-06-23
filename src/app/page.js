import Hero from "@/components/layout/Hero";
import FeaturedStartups from "@/components/home/FeaturedStartups";
import FeaturedOpportunities from "@/components/home/FeaturedOpportunities";
import WhyJoin from "@/components/home/WhyJoin";
import PlatformStats from "@/components/home/PlatformStats";

export default function Home() {
    return (
        <>
            <Hero />
            <FeaturedStartups />
            <FeaturedOpportunities />
            <WhyJoin />
            <PlatformStats />
        </>
    );
}
