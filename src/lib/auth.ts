import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const client = new MongoClient(process.env.DB_URI as string);
export const db = client.db("wedplan-system");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),

  user: {
    additionalFields: {
      role: {
        type: ["customer", "vendor", "admin"],
        input: false,
        defaultValue: "customer",
      },
      businessName: {
        type: "string",
        input: false,
        defaultValue: "",
      },
      registrationRolePending: {
        type: "boolean",
        input: false,
        defaultValue: true,
      },
      subscriptionPlan: {
        type: ["free", "premium"],
        input: false,
        defaultValue: "free",
      },
      subscriptionExpiresAt: {
        type: "string",
        input: false,
        defaultValue: "",
      },
      subscriptionCancelAtPeriodEnd: {
        type: "boolean",
        input: false,
        defaultValue: false,
      },
      isBlocked: {
        type: "boolean",
        input: false,
        defaultValue: false,
      },
    },
  },

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },
  socialProviders:
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          },
        }
      : {},
}); 
