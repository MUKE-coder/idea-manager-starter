"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const IdeaSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  categoryId: z.string().min(1, "Category is required"),
})

export type IdeaFormData = z.infer<typeof IdeaSchema>

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export async function createIdea(data: IdeaFormData) {
  try {
    const validatedData = IdeaSchema.parse(data)
    const slug = generateSlug(validatedData.title)

    const idea = await prisma.idea.create({
      data: {
        title: validatedData.title,
        slug,
        description: validatedData.description,
        categoryId: validatedData.categoryId,
      },
      include: {
        category: true,
      },
    })

    revalidatePath("/")
    return { success: true, data: idea }
  } catch (error) {
    console.error("Error creating idea:", error)
    return { success: false, error: "Failed to create idea" }
  }
}

export async function getIdeas(categoryId?: string) {
  try {
    const ideas = await prisma.idea.findMany({
      where: categoryId ? { categoryId } : undefined,
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
      },
    })

    return { success: true, data: ideas }
  } catch (error) {
    console.error("Error fetching ideas:", error)
    return { success: false, error: "Failed to fetch ideas" }
  }
}

export async function getIdeaById(id: string) {
  try {
    const idea = await prisma.idea.findUnique({
      where: { id },
      include: {
        category: true,
      },
    })

    return { success: true, data: idea }
  } catch (error) {
    console.error("Error fetching idea:", error)
    return { success: false, error: "Failed to fetch idea" }
  }
}

export async function updateIdea(id: string, data: IdeaFormData) {
  try {
    const validatedData = IdeaSchema.parse(data)
    const slug = generateSlug(validatedData.title)

    const idea = await prisma.idea.update({
      where: { id },
      data: {
        title: validatedData.title,
        slug,
        description: validatedData.description,
        categoryId: validatedData.categoryId,
      },
      include: {
        category: true,
      },
    })

    revalidatePath("/")
    return { success: true, data: idea }
  } catch (error) {
    console.error("Error updating idea:", error)
    return { success: false, error: "Failed to update idea" }
  }
}

export async function deleteIdea(id: string) {
  try {
    await prisma.idea.delete({
      where: { id },
    })

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Error deleting idea:", error)
    return { success: false, error: "Failed to delete idea" }
  }
}
