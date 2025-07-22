import { z } from "zod";

export const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters long').max(50, "Name can't exceed 50 characters"),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters long').max(128, "Password can't exceed 128 characters"),
    confirmPassword: z.string().min(8, 'Password must be at least 8 characters long').max(128, "Password can't exceed 128 characters"),
    categories: z.array(z.string()).min(1, 'Select at least one category'),
    budgetRange: z.number().min(0, 'Enter a budget of at least ₹0').max(1000000, 'Enter a budget of at most ₹1,000,000'),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});

export const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
});

export const forgotPasswordSchema = z.object({
    email: z.string().email(),
});

export const resetPasswordSchema = z.object({
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string().min(8, "Password must be at least 8 characters long"),
});

export const filterSchema = z.object({
    location: z.string().min(2, 'Location must be at least 2 characters long').max(50, "Location can't exceed 50 characters"),
    budgetRange: z.number().min(0, 'Enter a budget of at least ₹0').max(1000000, 'Enter a budget of at most ₹1,000,000'),
    capacity: z.number().min(0, 'Enter a capacity of at least 0').max(10000, 'Enter a capacity of at most 10,000'),
    startDate: z.date(),
    endDate: z.date(),
});