"use client";

import React, { useRef, useState } from "react";
import { Camera, UploadCloud, X, CheckCircle2, User } from "lucide-react";

interface PassportPhotoUploadProps {
  value?: string;
  onChange: (base64: string) => void;
  disabled?: boolean;
}

export default function PassportPhotoUpload({
  value,
  onChange,
  disabled = false,
}: PassportPhotoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const processImageFile = (file: File) => {
    setErrorMessage(null);

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please select a valid image file (JPG, PNG, or WEBP).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage("Image is too large. Please select an image under 10MB.");
      return;
    }

    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          // Resize to maximum 600x800 for optimal passport photo crispness and lightweight payload
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;
          const maxDim = 800;

          if (width > height) {
            if (width > maxDim) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
            onChange(dataUrl);
          } else {
            onChange(e.target?.result as string);
          }
        } catch (err) {
          console.error("Image processing error:", err);
          onChange(e.target?.result as string);
        } finally {
          setIsProcessing(false);
        }
      };

      img.onerror = () => {
        setIsProcessing(false);
        setErrorMessage("Failed to load image. Please try another photo.");
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      setIsProcessing(false);
      setErrorMessage("Error reading file.");
    };

    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processImageFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/webp,image/jpg"
        className="hidden"
        disabled={disabled}
      />

      {value ? (
        <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl border-2 border-emerald-500/30 bg-emerald-50/20">
          <div className="relative group w-28 h-36 rounded-xl overflow-hidden border-2 border-emerald-500 shadow-md bg-white shrink-0">
            <img
              src={value}
              alt="Uploaded Passport Photo"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={handleRemove}
              disabled={disabled}
              className="absolute top-1 right-1 p-1 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow transition-all opacity-90 group-hover:opacity-100"
              title="Remove photo"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1.5 text-center sm:text-left flex-1">
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-emerald-700 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4" /> Photo Attached Successfully
            </div>
            <p className="text-xs text-slate-600">
              Your official passport photo is attached to your application dossier.
            </p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 underline underline-offset-2"
            >
              Change / Re-upload photo
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => !disabled && fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 select-none ${
            isDragging
              ? "border-brand-500 bg-brand-50/50 scale-[1.01]"
              : "border-slate-300 bg-slate-50/50 hover:bg-slate-100/50 hover:border-slate-400"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-500">
            <Camera className="w-7 h-7 text-brand-600" />
          </div>

          <div>
            <span className="text-sm font-bold text-slate-800 block">
              {isProcessing ? "Processing Photo..." : "Click or Drag & Drop Passport Photo"}
            </span>
            <span className="text-xs text-slate-500 block mt-0.5">
              Clear front-facing passport photograph with plain background (PNG, JPG, WEBP)
            </span>
          </div>

          <button
            type="button"
            disabled={disabled || isProcessing}
            className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 flex items-center gap-1.5"
          >
            <UploadCloud className="w-4 h-4 text-brand-600" /> Browse Image File
          </button>
        </div>
      )}

      {errorMessage && (
        <p className="text-xs text-rose-600 font-medium">{errorMessage}</p>
      )}
    </div>
  );
}