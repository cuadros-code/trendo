import { z } from "zod"


export const SingupValidation = z.object({
  name: z.string().min(2, { message: "Name is too short" }),
  username: z.string().min(2, { message: "Username is too short" }),
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().min(6, { message: "Password is too short" }),
})

export const SinginValidation = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().min(6, { message: "Password is too short" }),
})

