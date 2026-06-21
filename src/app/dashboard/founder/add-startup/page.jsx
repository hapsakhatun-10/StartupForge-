"use client";

import { useForm } from "react-hook-form";
import Icons from "@/app/components/Icons";

export default function AddStartupPage() {
    const { register, handleSubmit, } = useForm();


    const onSubmit = async (data) => {
        const res = await fetch("http://localhost:5000/startup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await res.json();
        console.log(result);
    };


    return (
        <section className="max-w-5xl mx-auto px-4 py-10">
            <Icons />

            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8">
                <h1 className="text-3xl font-bold mb-6">Create Startup</h1>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                    <input
                        type="text"
                        placeholder="Startup Name"
                        {...register("startup_name")}
                        className="w-full border p-3 rounded"
                    />

                    <input
                        type="file"
                        {...register("logo")}
                        className="w-full border p-3 rounded"
                    />

                    <input
                        type="text"
                        placeholder="Industry"
                        {...register("industry")}
                        className="w-full border p-3 rounded"
                    />

                    <textarea
                        placeholder="Description"
                        {...register("description")}
                        className="w-full border p-3 rounded"
                    />

                    <select
                        {...register("funding_stage")}
                        className="w-full border p-3 rounded"
                    >
                        <option value="">Select Stage</option>
                        <option value="Idea">Idea</option>
                        <option value="Seed">Seed</option>
                        <option value="Series A">Series A</option>
                    </select>

                    <input
                        type="email"
                        placeholder="Founder Email"
                        {...register("founder_email")}
                        className="w-full border p-3 rounded"
                    />

                    <button
                        type="submit"
                        className="w-full bg-teal-500 text-white py-3 rounded"
                    >
                        Create Startup
                    </button>

                </form>
            </div>
        </section>
    );
}