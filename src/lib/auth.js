import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { bearer } from "better-auth/plugins";
import { MongoClient } from "mongodb";

let client;
let db;
function getClient() {
    if (!client) client = new MongoClient(process.env.MONGODB_URI);
    return client;
}
function getDb() {
    if (!db) db = getClient().db("StartupForge");
    return db;
}

export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL,
    database: mongodbAdapter(getDb()),
    emailAndPassword: { enabled: true },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        },
    },
    plugins: [bearer()],
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: false,
                defaultValue: "founder",
                input: true,
            },
            isBlocked: {
                type: "boolean",
                required: true,
                defaultValue: false,
                input: false,
            },
            skills: {
                type: "string",
                required: false,
                defaultValue: "",
                input: true,
            },
            bio: {
                type: "string",
                required: false,
                defaultValue: "",
                input: true,
            },
        },
    },
});
