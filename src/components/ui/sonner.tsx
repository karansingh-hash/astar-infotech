"use client"

import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          success: "group-[.toaster]:border-emerald-200 group-[.toaster]:bg-emerald-50 group-[.toaster]:text-emerald-900",
          error: "group-[.toaster]:border-red-200 group-[.toaster]:bg-red-50 group-[.toaster]:text-red-900",
        },
      }}
      richColors
      expand
      position="top-right"
      duration={3000}
      {...props}
    />
  )
}

export { Toaster }
