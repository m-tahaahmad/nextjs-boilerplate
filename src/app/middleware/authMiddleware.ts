import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "../lib/jwt";

export const authMiddleware = (handler: Function) => {
  return async (req: NextRequest) => {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Authorization token missing" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    (req as any).user = decoded;

    return handler(req);
  };
};
