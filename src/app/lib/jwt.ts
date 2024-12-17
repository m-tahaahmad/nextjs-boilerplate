//@ts-ignore
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export const generateToken = (payload: object, expiresIn = "24h") => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

export const destroyToken = (token: string) => {
  try {
    return jwt.destroy(token);
  } catch (error) {
    return null;
  }
};
