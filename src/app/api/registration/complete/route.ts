import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { auth, db } from "@/lib/auth";

type SignupRole = "customer" | "vendor";

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Please sign in to finish registration." }, { status: 401 });
  }

  let body: { role?: unknown; businessName?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid registration details." }, { status: 400 });
  }

  const role = body.role;
  if (role !== "customer" && role !== "vendor") {
    return NextResponse.json({ message: "Choose Customer or Vendor." }, { status: 400 });
  }

  const businessName = typeof body.businessName === "string" ? body.businessName.trim() : "";
  if (role === "vendor" && !businessName) {
    return NextResponse.json({ message: "Business or studio name is required for vendors." }, { status: 400 });
  }
  if (businessName.length > 120) {
    return NextResponse.json({ message: "Business name is too long." }, { status: 400 });
  }
  if (!/^[a-f\d]{24}$/i.test(session.user.id)) {
    return NextResponse.json({ message: "Invalid account session." }, { status: 401 });
  }

  const userId = new ObjectId(session.user.id);
  const users = db.collection("user");
  const result = await users.updateOne(
    { _id: userId, registrationRolePending: true },
    {
      $set: {
        role: role as SignupRole,
        businessName: role === "vendor" ? businessName : "",
        registrationRolePending: false,
      },
    },
  );

  if (result.matchedCount === 0) {
    const currentUser = await users.findOne({ _id: userId }, { projection: { role: 1, businessName: 1 } });
    if (
      currentUser?.role === role &&
      (role !== "vendor" || currentUser.businessName === businessName)
    ) {
      return NextResponse.json({ message: "Registration complete." });
    }
    return NextResponse.json({ message: "Registration is already complete." }, { status: 409 });
  }

  return NextResponse.json({ message: "Registration complete." });
}
