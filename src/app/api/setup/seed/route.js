import { auth } from "@/lib/auth";
import { MongoClient } from "mongodb";

export async function GET() {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        return Response.json({ error: "MONGODB_URI not set" }, { status: 500 });
    }

    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db("StartupForge");
        const users = db.collection("user");

        const existing = await users.findOne({ email: "admin@startupforge.com" });

        if (existing) {
            await users.deleteOne({ email: "admin@startupforge.com" });
        }

        const { data, error } = await auth.api.signUpEmail({
            body: {
                name: "Admin",
                email: "admin@startupforge.com",
                password: "Admin@123",
            },
        });

        if (error) {
            return Response.json({ error: error.message || "Sign-up failed" }, { status: 500 });
        }

        await users.updateOne(
            { email: "admin@startupforge.com" },
            { $set: { role: "admin", emailVerified: true } }
        );

        return Response.json({
            message: "Admin created! Log in with admin@startupforge.com / Admin@123",
        });
    } catch (e) {
        return Response.json({ error: e.message || "Unknown error" }, { status: 500 });
    } finally {
        await client.close();
    }
}
