"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const CategorySchema = z.object({
  title: z.string().min(1, "Title is required"),
})

export type CategoryFormData = z.infer<typeof CategorySchema>

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export async function createCategory(data: CategoryFormData) {
  try {
    const validatedData = CategorySchema.parse(data)
    const slug = generateSlug(validatedData.title)

    const category = await prisma.category.create({
      data: {
        title: validatedData.title,
        slug,
      },
    })

    revalidatePath("/")
    return { success: true, data: category }
  } catch (error) {
    console.error("Error creating category:", error)
    return { success: false, error: "Failed to create category" }
  }
}

export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { ideas: true },
        },
      },
    })

    return { success: true, data: categories }
  } catch (error) {
    console.error("Error fetching categories:", error)
    return { success: false, error: "Failed to fetch categories" }
  }
}

export async function updateCategory(id: string, data: CategoryFormData) {
  try {
    const validatedData = CategorySchema.parse(data)
    const slug = generateSlug(validatedData.title)

    const category = await prisma.category.update({
      where: { id },
      data: {
        title: validatedData.title,
        slug,
      },
    })

    revalidatePath("/")
    return { success: true, data: category }
  } catch (error) {
    console.error("Error updating category:", error)
    return { success: false, error: "Failed to update category" }
  }
}

export async function deleteCategory(id: string) {
  try {
    await prisma.category.delete({
      where: { id },
    })

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Error deleting category:", error)
    return { success: false, error: "Failed to delete category" }
  }
}
