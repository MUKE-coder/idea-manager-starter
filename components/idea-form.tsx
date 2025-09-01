"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet"
import { RichTextEditor } from "@/components/rich-text-editor"
import { ScrollArea } from "@/components/ui/scroll-area"

const ideaSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  description: z.string().min(1, "Description is required"),
})

type IdeaFormData = z.infer<typeof ideaSchema>

interface IdeaFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: { title: string; slug: string; description: string; categoryId: string }) => void
  categoryId: string
  initialData?: { title: string; slug: string; description: string }
}

export function IdeaForm({ open, onOpenChange, onSubmit, categoryId, initialData }: IdeaFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<IdeaFormData>({
    resolver: zodResolver(ideaSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
    },
  })

  const description = watch("description")

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const onFormSubmit = (data: IdeaFormData) => {
    const slug = generateSlug(data.title)
    onSubmit({
      title: data.title.trim(),
      slug,
      description: data.description.trim(),
      categoryId,
    })
    reset()
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:w-[600px] md:w-[700px] lg:w-[800px] flex flex-col">
        <SheetHeader className="flex-shrink-0">
          <SheetTitle>{initialData ? "Edit Idea" : "Add New Idea"}</SheetTitle>
        </SheetHeader>

        <ScrollArea className="flex-1 pr-6">
          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6 pb-6">
            <div className="space-y-2">
              <Label htmlFor="idea-title">Title</Label>
              <Input id="idea-title" {...register("title")} placeholder="Enter idea title" />
              {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="idea-description">Description</Label>
              <RichTextEditor
                value={description}
                onChange={(value) => setValue("description", value)}
                placeholder="Write your idea description with rich formatting..."
                className="min-h-[300px]"
              />
              {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
            </div>
          </form>
        </ScrollArea>

        <SheetFooter className="flex-shrink-0 border-t pt-4">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit(onFormSubmit)} disabled={isSubmitting}>
            {initialData ? "Update" : "Create"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
