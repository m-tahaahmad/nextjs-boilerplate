import prisma from "@/app/lib/prisma";
import { apiResponse } from "@/app/helpers/functions";
import bcrypt from "bcrypt";
import { z } from "zod";
import { generateToken } from "@/app/lib/jwt";

const userSchema = z.object({
  email: z.string().email("Email is invalid"),
  password: z.string().min(1, "Password field is required"),
});

export async function POST(req: Request) {
  if (req.method == "POST") {
    try {
      let body = await req.json();

      const parsedData = userSchema.parse(body);

      const existingUser = await prisma.users.findFirst({
        where: {
          email: parsedData.email,
        },
      });

      if (!existingUser) {
        return apiResponse(
          false,
          { email: "No user registered with this email" },
          404
        );
      }

      const checkPassword = await bcrypt.compare(
        parsedData.password,
        existingUser.password
      );

      if (!checkPassword) {
        return apiResponse(false, { password: "Incorrect Password" }, 401);
      }

      const token = generateToken({ userId: existingUser.id });

      return apiResponse(true, {
        token: token,
        type: "Bearer",
        expires_in: "24h",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return apiResponse(
          false,
          error.errors.map((e) => e.message),
          400
        );
      }
      return apiResponse(false, "Internal Server Error", 500);
    }
  } else {
    return apiResponse(false, "Method Not Allowed", 405);
  }
}
