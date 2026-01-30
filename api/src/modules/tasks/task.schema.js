import * as z from 'zod'

export const createTaskSchema = z.object({
    title: z.string("Title must be a string").trim().min(1, { message: "Title is required"}),
    description: z.string("Description must be a string").trim().optional(),
    date: z.iso.datetime().optional()
})

export const updateTaskSchema = z.object({
    title: z.string("Title must be a string").trim().min(1, { message: "Title is required"}),
    description: z.string("Description must be a string").trim().optional(),
    date: z.iso.datetime().optional()
})