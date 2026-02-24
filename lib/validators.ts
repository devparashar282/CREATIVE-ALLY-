import { z } from "zod";

export const phoneSchema = z.object({
  countryCode: z.string().min(1),
  phone: z.string().regex(/^[0-9]{7,15}$/)
});

export const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  countryCode: z.string().min(1),
  phone: z.string().regex(/^[0-9]{7,15}$/),
  subject: z.string().min(3),
  message: z.string().min(10)
});

export const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  countryCode: z.string().min(1),
  phone: z.string().regex(/^[0-9]{7,15}$/)
});

export const forgotPasswordSchema = z.object({
  email: z.string().email()
});

export const resetPasswordSchema = z.object({
  token: z.string().min(20),
  password: z.string().min(8)
});

export const campusAmbassadorSchema = z.object({
  name: z.string().min(2),
  college: z.string().min(2),
  email: z.string().email(),
  countryCode: z.string().min(1),
  phone: z.string().regex(/^[0-9]{7,15}$/)
});

export const checkoutSchema = z.object({
  type: z.enum(["course", "internship"]),
  itemId: z.string().min(1),
  name: z.string().min(2),
  college: z.string().min(2),
  email: z.string().email(),
  countryCode: z.string().min(1),
  phone: z.string().regex(/^[0-9]{7,15}$/)
});
