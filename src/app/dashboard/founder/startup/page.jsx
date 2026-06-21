"use client";

import { useEffect, useState } from "react";

export default function StartupList() {
    const [startups, setStartups] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("http://localhost:5000/startup");
                const data = await res.json();

                setStartups(data); // backend array return করলে direct set
            } catch (error) {
                console.log("Error fetching startups:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <p className="text-center">Loading...</p>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {startups.map((item, index) => (
                <div
                    key={index}
                    className="bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-200 shadow-xl p-8 hover:shadow-2xl transition"
                >
                    <h2 className="text-2xl font-bold text-gray-800">
                        {item.startup_name}
                    </h2>

                    <p className="text-gray-500 mt-1">
                        {item.industry}
                    </p>

                    <p className="mt-3 text-gray-600 line-clamp-3">
                        {item.description}
                    </p>

                    <div className="mt-4 text-sm text-gray-500">
                        <p>📧 {item.founder_email}</p>
                        <p>📊 {item.funding_stage}</p>
                    </div>

                    <button className="mt-5 w-full py-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold">
                        View Details
                    </button>
                </div>
            ))}
        </div>
    );
}