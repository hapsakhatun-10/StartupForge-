"use client";

import { useState } from "react";
import StatCard from "./components/StatCard";
import StartupForm from "./components/StartupForm";
import OpportunityForm from "./components/OpportunityForm";
import OpportunityList from "./components/OpportunityList";
import ApplicationList from "./components/ApplicationList";

export default function FounderDashboard() {
    const [activeTab, setActiveTab] = useState("overview");

    return (
        <div className="min-h-screen bg-gray-950 text-white p-6">
            {/* Header */}
            <h1 className="text-3xl font-bold mb-6">Founder Dashboard</h1>

            {/* Navigation */}
            <div className="flex gap-3 mb-6 flex-wrap">
                {[
                    "overview",
                    "startup",
                    "opportunities",
                    "manage",
                    "applications",
                ].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-lg capitalize ${activeTab === tab
                                ? "bg-blue-600"
                                : "bg-gray-800 hover:bg-gray-700"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* CONTENT */}
            {activeTab === "overview" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatCard title="Total Opportunities" value="12" />
                    <StatCard title="Total Applications" value="48" />
                    <StatCard title="Accepted Members" value="9" />
                </div>
            )}

            {activeTab === "startup" && <StartupForm />}

            {activeTab === "opportunities" && <OpportunityForm />}

            {activeTab === "manage" && <OpportunityList />}

            {activeTab === "applications" && <ApplicationList />}
        </div>
    );
}