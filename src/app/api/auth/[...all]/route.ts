import { auth } from "@/lib/auth"; // path to your auth file
import { toNextJsHandler } from "better-auth/next-js";

const handlers = toNextJsHandler(auth);

export const GET = handlers.GET;

export async function POST(request: Request) {
  const path = new URL(request.url).pathname;

  if (path.endsWith("/sign-up/email")) {
    const body = await request.clone().json().catch(() => null);
    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const email = typeof body?.email === "string" ? body.email.trim() : "";
    const password = typeof body?.password === "string" ? body.password : "";

    if (!name || name.length > 100) {
      return Response.json({ message: "Enter a name between 1 and 100 characters." }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ message: "Enter a valid email address." }, { status: 400 });
    }

    if (password.length < 6 || !/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
      return Response.json(
        { message: "Password must be at least 6 characters and include an uppercase and a lowercase letter." },
        { status: 400 },
      );
    }
  }

  return handlers.POST(request);
}

//form submit korar por database a jaoar function ta better auth handle kore.atar madhome database r sathe connection make kora hoa.
