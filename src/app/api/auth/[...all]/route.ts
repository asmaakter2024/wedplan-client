import { auth } from "@/lib/auth"; // path to your auth file
import { toNextJsHandler } from "better-auth/next-js";

export const { POST, GET } = toNextJsHandler(auth);

//form submit korar por database a jaoar function ta better auth handle kore.atar madhome database r sathe connection make kora hoa.