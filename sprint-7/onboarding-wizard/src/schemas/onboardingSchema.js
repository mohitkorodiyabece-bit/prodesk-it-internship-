import { z } from "zod";

const phoneRegex = /^\d{10}$/;
const usernameRegex = /^[A-Za-z0-9_]+$/;
const uppercaseRegex = /[A-Z]/;
const lowercaseRegex = /[a-z]/;
const numberRegex = /[0-9]/;
const specialCharRegex = /[!@#$%^&*(),.?":{}|<>_\-+=[\]\\/;'`~]/;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const personalInfoSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required")
    .trim()
    .refine((val) => val.length >= 2, {
      message: "Full name must be at least 2 characters",
    })
    .refine((val) => val.trim().length > 0, {
      message: "Full name cannot be whitespace only",
    }),
  email: z
    .string()
    .min(1, "Email address is required")
    .refine((val) => emailRegex.test(val), {
      message: "Please enter a valid email address (e.g. name@example.com)",
    }),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .transform((val) => val.replace(/[\s()-]/g, ""))
    .refine((val) => phoneRegex.test(val), {
      message: "Phone number must contain exactly 10 digits",
    }),
  dateOfBirth: z
    .string()
    .min(1, "Date of birth is required")
    .refine(
      (val) => {
        const date = new Date(val);
        return !Number.isNaN(date.getTime());
      },
      { message: "Please enter a valid date" }
    )
    .refine(
      (val) => {
        const date = new Date(val);
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        return date <= today;
      },
      { message: "Date of birth cannot be in the future" }
    ),
});

export const accountDetailsSchema = z
  .object({
    username: z
      .string()
      .min(1, "Username is required")
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username must be at most 20 characters")
      .refine((val) => usernameRegex.test(val), {
        message: "Only letters, numbers, and underscores are allowed",
      }),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .refine((val) => uppercaseRegex.test(val), {
        message: "Password must include at least one uppercase letter",
      })
      .refine((val) => lowercaseRegex.test(val), {
        message: "Password must include at least one lowercase letter",
      })
      .refine((val) => numberRegex.test(val), {
        message: "Password must include at least one number",
      })
      .refine((val) => specialCharRegex.test(val), {
        message: "Password must include at least one special character",
      }),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    accountType: z
      .string()
      .min(1, "Please select an account type")
      .refine((val) => ["personal", "business", "creator", "enterprise"].includes(val), {
        message: "Please select a valid account type",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const onboardingSchema = z
  .object({
    fullName: personalInfoSchema.shape.fullName,
    email: personalInfoSchema.shape.email,
    phone: personalInfoSchema.shape.phone,
    dateOfBirth: personalInfoSchema.shape.dateOfBirth,
    username: z
      .string()
      .min(1, "Username is required")
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username must be at most 20 characters")
      .refine((val) => usernameRegex.test(val), {
        message: "Only letters, numbers, and underscores are allowed",
      }),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .refine((val) => uppercaseRegex.test(val), {
        message: "Password must include at least one uppercase letter",
      })
      .refine((val) => lowercaseRegex.test(val), {
        message: "Password must include at least one lowercase letter",
      })
      .refine((val) => numberRegex.test(val), {
        message: "Password must include at least one number",
      })
      .refine((val) => specialCharRegex.test(val), {
        message: "Password must include at least one special character",
      }),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    accountType: z
      .string()
      .min(1, "Please select an account type")
      .refine((val) => ["personal", "business", "creator", "enterprise"].includes(val), {
        message: "Please select a valid account type",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const STEP_FIELDS = {
  1: ["fullName", "email", "phone", "dateOfBirth"],
  2: ["username", "password", "confirmPassword", "accountType"],
};

export const defaultOnboardingValues = {
  fullName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  username: "",
  password: "",
  confirmPassword: "",
  accountType: "",
};