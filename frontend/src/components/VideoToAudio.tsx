import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../service/store";
import {
  Upload,
  FileVideo,
  Music,
  Download,
  Loader2,
  X,
  Play,
} from "lucide-react";
import API_URL from "../config";

const VideoToAudio: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { token } = useSelector((state: RootState) => state.auth);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError("");
      setAudioUrl(null);
    }
  };

  const handleConvert = async () => {
    if (!file) return;

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${API_URL}/convert/video-to-audio`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "Conversion failed");
      }

      const data = await response.json();
      // Fetch audio with auth to create blob URL
      const audioResp = await fetch(data.url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!audioResp.ok) throw new Error("Failed to load audio");
      const blob = await audioResp.blob();
      const blobUrl = URL.createObjectURL(blob);
      setAudioUrl(blobUrl);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setError("");
      setAudioUrl(null);
    }
  };

  const clearFile = () => {
    setFile(null);
    setAudioUrl(null);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold text-gradient">Video to Audio</h2>
        <p className="text-slate-400 text-lg">
          Extract high-quality audio from your videos instantly
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Input Section */}
        <div className="md:col-span-2 space-y-6">
          <div
            className={`relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300 ${
              dragActive
                ? "border-accent-purple bg-accent-purple/10"
                : "border-white/10 bg-white/5 hover:border-accent-purple/50 hover:bg-white/[0.07]"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />

            <div className="flex flex-col items-center justify-center text-center space-y-4">
              {file ? (
                <>
                  <div className="w-16 h-16 rounded-full bg-accent-purple/20 flex items-center justify-center">
                    <FileVideo className="w-8 h-8 text-accent-purple" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-white">
                      {file.name}
                    </p>
                    <p className="text-sm text-slate-400">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      clearFile();
                    }}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                    <Upload className="w-8 h-8 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-slate-200">
                      Drag & Drop your video here
                    </p>
                    <p className="text-sm text-slate-500 mt-1">
                      or click to browse files
                    </p>
                  </div>
                  <div className="flex gap-2 text-xs text-slate-600 uppercase tracking-wider">
                    <span>MP4</span>
                    <span>•</span>
                    <span>MOV</span>
                    <span>•</span>
                    <span>AVI</span>
                    <span>•</span>
                    <span>MKV</span>
                  </div>
                </>
              )}
            </div>
          </div>

          <button
            onClick={handleConvert}
            disabled={loading || !file}
            className="btn-primary w-full py-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Extracting Audio...
              </>
            ) : (
              <>
                <Music className="w-6 h-6" />
                Extract Audio Now
              </>
            )}
          </button>
        </div>

        {/* Output Section */}
        <div className="md:col-span-1">
          <div className="h-full bg-slate-900/50 rounded-2xl border border-slate-800 p-6 flex flex-col items-center justify-center text-center space-y-6">
            {audioUrl ? (
              <>
                <div className="w-20 h-20 rounded-full bg-accent-pink/10 flex items-center justify-center animate-pulse-slow">
                  <Music className="w-10 h-10 text-accent-pink" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-white">
                    Extraction Complete
                  </h3>
                  <p className="text-sm text-slate-400">
                    Your audio is ready to download
                  </p>
                </div>
                <div className="w-full space-y-4">
                  <audio src={audioUrl} controls className="w-full" />
                  <a
                    href={audioUrl}
                    download={`extracted-${file?.name.split(".")[0]}.mp3`}
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors border border-white/10"
                  >
                    <Download className="w-4 h-4" />
                    Download MP3
                  </a>
                </div>
              </>
            ) : (
              <>
                <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center">
                  <Play className="w-10 h-10 text-slate-600 ml-1" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-slate-300">
                    No Audio Yet
                  </h3>
                  <p className="text-sm text-slate-500">
                    Upload a video to extract its audio track
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-error/10 border border-error/30 text-error animate-float">
          <div className="flex items-center gap-3">
            <span className="font-medium">{error}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoToAudio;
