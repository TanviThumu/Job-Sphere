import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  UploadCloud,
  FileText,
  X,
  CheckCircle,
} from "lucide-react";

function UploadCard() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");

  const [resumeText, setResumeText] = useState("");

  const showMessage = (text, type = "error") => {
    setMessage(text);
    setMessageType(type);
  };

  const closeMessage = () => {
    setMessage("");
  };

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    setError("");

    if (rejectedFiles.length > 0) {
      setError("Please upload a PDF or DOCX file under 5 MB.");
      return;
    }

    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const {
    getRootProps,
    getInputProps,
    open,
    isDragActive,
  } = useDropzone({
    onDrop,
    noClick: true,
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
  });

  const removeFile = () => {
    setFile(null);
    setError("");
    setResumeText("");
  };

  const handleUpload = async () => {
    if (!file) {
      showMessage("Please upload your resume first.");
      return;
    }

    try {
      setUploading(true);
      setError("");

      const formData = new FormData();

      formData.append("resume", file);

      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/resume/upload",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      // JWT expired or invalid
      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "/login";
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        showMessage(
          data.message || "Unable to process your resume."
        );
        return;
      }

      // Save extracted resume text temporarily
      setResumeText(data.text);

      showMessage(
        "Resume uploaded and processed successfully.",
        "success"
      );

      console.log("Extracted Resume Text:", data.text);

    } catch (error) {
      console.error("Resume upload error:", error);

      showMessage(
        "Unable to connect to the server. Please try again."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-5">

      {/* ================= POPUP ================= */}

      {message && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 px-4">

          <div className="relative w-full max-w-xs bg-white rounded-lg shadow-lg border border-slate-200 p-5">

            {/* Close */}
            <button
              type="button"
              onClick={closeMessage}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-700 transition"
            >
              <X size={17} />
            </button>

            {/* Icon */}
            <div className="flex justify-center mb-4">

              {messageType === "success" ? (
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle
                    size={20}
                    className="text-emerald-600"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                  <span className="text-xl font-semibold text-blue-600">
                    !
                  </span>
                </div>
              )}

            </div>

            {/* Message */}
            <p className="text-center text-base font-medium text-slate-600 leading-relaxed px-2">
              {message}
            </p>

            {/* Button */}
            <button
              type="button"
              onClick={closeMessage}
              className={`w-full mt-5 py-2.5 rounded-md text-sm font-medium text-white transition ${
                messageType === "success"
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              Okay
            </button>

          </div>

        </div>
      )}

      {/* ================= HEADER ================= */}

      <div>
        <h2 className="text-base sm:text-lg font-semibold text-slate-900">
          Upload Resume
        </h2>

        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Upload your resume to start AI analysis.
        </p>
      </div>

      {/* ================= ERROR ================= */}

      {error && (
        <div className="mt-3 flex items-center gap-2 bg-red-50 border border-red-200 rounded-md px-3 py-2">

          <X
            size={15}
            className="text-red-500 flex-shrink-0"
          />

          <p className="text-xs text-red-600">
            {error}
          </p>

        </div>
      )}

      {/* ================= UPLOAD ================= */}

      {!file ? (
        <div
          {...getRootProps()}
          className={`mt-4 border-2 border-dashed rounded-lg p-5 sm:p-6 text-center transition ${
            isDragActive
              ? "border-blue-500 bg-blue-50"
              : "border-slate-300 hover:border-blue-400"
          }`}
        >

          <input {...getInputProps()} />

          {/* Icon */}
          <div className="flex justify-center">

            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
              <UploadCloud
                size={22}
                className="text-blue-600"
              />
            </div>

          </div>

          {/* Text */}
          <p className="mt-3 text-xs sm:text-sm font-medium text-slate-700">
            {isDragActive
              ? "Drop your resume here"
              : "Drag & drop your resume here"}
          </p>

          <p className="mt-1 text-[11px] sm:text-xs text-slate-500">
            or choose a file from your device
          </p>

          {/* Choose File */}
          <button
            type="button"
            onClick={open}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md text-xs sm:text-sm font-medium hover:bg-blue-700 transition"
          >
            Choose File
          </button>

          <p className="mt-3 text-[10px] sm:text-xs text-slate-400">
            PDF or DOCX • Maximum 5 MB
          </p>

        </div>
      ) : (
        /* ================= FILE SELECTED ================= */

        <div className="mt-4 border border-slate-200 rounded-lg p-4">

          <div className="flex items-center justify-between gap-3">

            {/* File */}
            <div className="flex items-center gap-3 min-w-0">

              <div className="w-9 h-9 rounded-md bg-blue-50 flex items-center justify-center flex-shrink-0">

                <FileText
                  size={19}
                  className="text-blue-600"
                />

              </div>

              <div className="min-w-0">

                <p className="text-sm font-medium text-slate-800 truncate">
                  {file.name}
                </p>

                <p className="text-[11px] text-slate-500 mt-0.5">
                  {(file.size / 1024).toFixed(1)} KB
                </p>

              </div>

            </div>

            {/* Remove */}
            <button
              type="button"
              onClick={removeFile}
              className="text-slate-400 hover:text-red-500 transition flex-shrink-0"
            >
              <X size={17} />
            </button>

          </div>

          {/* Ready */}
          <div className="flex items-center gap-2 mt-4">

            <CheckCircle
              size={15}
              className="text-emerald-500"
            />

            <p className="text-xs text-emerald-600">
              Resume ready for analysis
            </p>

          </div>

          {/* Analyze */}
          <button
            type="button"
            onClick={handleUpload}
            disabled={uploading}
            className="mt-4 w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-md text-xs sm:text-sm font-medium transition"
          >
            {uploading
              ? "Uploading..."
              : "Analyze Resume"}
          </button>

          {/* Extracted text indicator */}
          {resumeText && (
            <p className="text-[11px] text-emerald-600 text-center mt-2">
              Resume text extracted successfully.
            </p>
          )}

        </div>
      )}

    </div>
  );
}

export default UploadCard;