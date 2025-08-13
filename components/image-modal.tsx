"use client"

import type React from "react"

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { useState } from "react"
import Image from "next/image"
import { ZoomIn } from "lucide-react"

interface ImageModalProps {
  src: string
  alt: string
  trigger: React.ReactNode
}

export function ImageModal({ src, alt, trigger }: ImageModalProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="cursor-pointer relative group">
          {trigger}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="bg-white bg-opacity-80 rounded-full p-2">
              <ZoomIn className="h-6 w-6 text-black" />
            </div>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] p-0 border-none bg-transparent shadow-none">
        <div className="relative w-full max-h-[90vh] flex items-center justify-center">
          <div className="relative max-w-full max-h-full">
            <Image
              src={src || "/placeholder.svg"}
              alt={alt}
              width={800}
              height={600}
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              priority
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
