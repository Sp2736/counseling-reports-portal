// src/app/student/upload/page.tsx
"use client";

import { useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, FileText, CheckCircle, AlertCircle } from "lucide-react";

export default function StudentUploadPage() {
  const { data: session } = useSession();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setUploadStatus("idle");
      setErrorMessage("");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"]
    },
    maxFiles: 1,
  });

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    setUploadStatus("idle");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/swot/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Upload failed");
      }

      setUploadStatus("success");
      setFile(null); 
    } catch (error: any) {
      setUploadStatus("error");
      setErrorMessage(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Submit SWOT Analysis</h1>
        <p className="text-gray-600 mb-8">
          Upload your completed counseling form (Strictly .docx format). Our system will analyze it and send it to your assigned counselor.
        </p>

        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
          
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors duration-200 ease-in-out ${
              isDragActive ? "border-indigo-500 bg-indigo-50" : "border-gray-300 hover:border-indigo-400 hover:bg-gray-50"
            }`}
          >
            <input {...getInputProps()} />
            <UploadCloud className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            {isDragActive ? (
              <p className="text-indigo-600 font-medium">Drop the Word document here...</p>
            ) : (
              <div>
                <p className="text-gray-700 font-medium mb-1">Drag & drop your Word file here, or click to select</p>
                <p className="text-sm text-gray-500">Supported formats: .docx only</p>
              </div>
            )}
          </div>

          {file && (
            <div className="mt-6 p-4 bg-indigo-50 border border-indigo-100 rounded-lg flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileText className="h-6 w-6 text-indigo-500" />
                <span className="text-sm font-medium text-gray-800">{file.name}</span>
              </div>
              <button
                onClick={() => setFile(null)}
                className="text-sm text-red-500 hover:text-red-700 font-medium"
                disabled={isUploading}
              >
                Remove
              </button>
            </div>
          )}

          {uploadStatus === "success" && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <p className="text-sm text-green-700 font-medium">File uploaded successfully!</p>
            </div>
          )}

          {uploadStatus === "error" && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-700 font-medium">{errorMessage}</p>
            </div>
          )}

          <div className="mt-8 flex justify-end">
            <button
              onClick={handleUpload}
              disabled={!file || isUploading}
              className={`px-6 py-2 rounded-md text-white font-medium transition-colors ${
                !file || isUploading ? "bg-indigo-300 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {isUploading ? "Uploading & Processing..." : "Submit File"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}