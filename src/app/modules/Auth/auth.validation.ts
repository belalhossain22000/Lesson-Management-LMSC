import { z } from "zod";

const changePasswordValidationSchema = z.object({
  oldPassword: z.string().min(8),
  newPassword: z.string().min(8),
});

const LoginValidationSchema = z.object({
  email: z.string().email({ message: "Invalid email format" }),

  role: z.enum(["student", "teacher"], {
    required_error: "Role is required",
    invalid_type_error: "Invalid role",
  }),
});

export const authValidation = {
  LoginValidationSchema,
  changePasswordValidationSchema,
};
