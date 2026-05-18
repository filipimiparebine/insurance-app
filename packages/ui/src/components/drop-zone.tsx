"use client";

import { useRef, useState, useCallback, type DragEvent } from "react"
import { motion } from "framer-motion"
import { Upload, FileText, Image as ImageIcon } from "lucide-react"
import { cn } from "../lib/utils"
import { Badge } from "./badge"

export interface DropFile {
  id: string
  file: File
  preview: string
  label: "talon" | "ci" | "unknown"
}

interface DropZoneProps {
  onFilesDrop: (files: DropFile[]) => void
  maxFiles?: number
  acceptedFormats?: string[]
  className?: string
}

function categorizeFile(file: File): DropFile["label"] {
  const name = file.name.toLowerCase()
  if (name.includes("talon") || name.includes("certificat") || name.includes("înmatriculare")) {
    return "talon"
  }
  if (name.includes("ci") || name.includes("buletin") || name.includes("carte") || name.includes("identitate")) {
    return "ci"
  }
  return "unknown"
}

export function DropZone({
  onFilesDrop,
  maxFiles = 2,
  acceptedFormats = ["image/jpeg", "image/png", "image/webp", "application/pdf"],
  className,
}: DropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [files, setFiles] = useState<DropFile[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  const processFiles = useCallback(
    (fileList: FileList) => {
      const newFiles: DropFile[] = []
      const remaining = maxFiles - files.length

      for (let i = 0; i < Math.min(fileList.length, remaining); i++) {
        const file = fileList[i]
        if (!acceptedFormats.includes(file.type) && file.type !== "") continue

        newFiles.push({
          id: `${file.name}-${Date.now()}`,
          file,
          preview: URL.createObjectURL(file),
          label: categorizeFile(file),
        })
      }

      const updated = [...files, ...newFiles].slice(0, maxFiles)
      setFiles(updated)
      onFilesDrop(updated)
    },
    [files, maxFiles, acceptedFormats, onFilesDrop],
  )

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      if (e.dataTransfer.files.length > 0) {
        processFiles(e.dataTransfer.files)
      }
    },
    [processFiles],
  )

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false)
  }, [])

  const handleClick = useCallback(() => {
    inputRef.current?.click()
  }, [])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        processFiles(e.target.files)
      }
    },
    [processFiles],
  )

  const removeFile = useCallback(
    (id: string) => {
      const updated = files.filter((f) => f.id !== id)
      setFiles(updated)
      onFilesDrop(updated)
    },
    [files, onFilesDrop],
  )

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <motion.div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-300 bg-surface p-12 text-center transition-all duration-200",
          isDragOver &&
            "border-brand-accent shadow-glow-accent bg-brand-accent-soft",
        )}
        whileHover={{ scale: 1.01 }}
        animate={
          isDragOver
            ? { scale: 1.02 }
            : { scale: 1 }
        }
      >
        <motion.div
          animate={
            isDragOver
              ? { y: -8, scale: 1.1 }
              : { y: 0, scale: 1 }
          }
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <Upload className="mx-auto h-12 w-12 text-neutral-400" />
        </motion.div>

        <p className="mt-4 text-lg font-medium font-body text-primary">
          {isDragOver
            ? "Eliberează pentru încărcare"
            : "Trage talonul și CI aici"}
        </p>
        <p className="mt-1 text-sm font-body text-neutral-500">
          sau apasă pentru a alege
        </p>
        <p className="mt-2 text-xs font-body text-neutral-400">
          JPEG, PNG, WebP, PDF — maxim 5MB per fișier
        </p>

        <input
          ref={inputRef}
          type="file"
          multiple
          accept={acceptedFormats.join(",")}
          className="hidden"
          onChange={handleInputChange}
        />
      </motion.div>

      {files.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {files.map((f) => (
            <motion.div
              key={f.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="group relative overflow-hidden rounded-lg border border-neutral-200 bg-surface"
            >
              {f.file.type.startsWith("image/") ? (
                <img
                  src={f.preview}
                  alt={f.file.name}
                  className="h-24 w-full object-cover"
                />
              ) : (
                <div className="flex h-24 items-center justify-center bg-neutral-50">
                  <FileText className="h-8 w-8 text-neutral-400" />
                </div>
              )}
              <div className="flex items-center justify-between p-2">
                <Badge
                  variant={f.label === "unknown" ? "outline" : "brand"}
                >
                  {f.label === "talon"
                    ? "Talon"
                    : f.label === "ci"
                      ? "CI"
                      : "Document"}
                </Badge>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    removeFile(f.id)
                  }}
                  className="text-xs text-neutral-400 hover:text-danger transition-colors"
                >
                  Șterge
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
