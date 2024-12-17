import prisma from "@/app/lib/prisma";
import apiResponse from "@/app/helpers/functions";
import bcrypt from "bcrypt";
import { z } from "zod";

const userSchema = z.object({
  first_name: z.string().min(1, "First Name is required"),
  email: z.string().email("Email is invalid"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export async function POST(req: Request) {
  if (req.method == "POST") {
    try {
      let body = await req.json();

      const parsedData = userSchema.parse(body);

      const existingUser = await prisma.users.findUnique({
        where: {
          email: parsedData.email,
        },
      });

      if (existingUser) {
        return apiResponse(false, "Email already is use", 409);
      }

      if (parsedData.password) {
        parsedData.password = await bcrypt.hash(parsedData.password, 10);
      }

      await prisma.users.create({
        // @ts-ignore
        data: parsedData,
      });

      return apiResponse(true, null, 201);
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
