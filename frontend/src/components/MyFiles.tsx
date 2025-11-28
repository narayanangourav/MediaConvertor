import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../service/store";
import {
  FileAudio,
  Download,
  Calendar,
  HardDrive,
  Music,
  Video,
  FileText,
  Search,
  Filter,
} from "lucide-react";
import API_URL from "../config";

interface MediaFile {
  filename: string;
  original_name: string;
  file_type: string;
  file_size: number;
  created_at: string;
  download_url: string;
}

const MyFiles: React.FC = () => {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const { token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch(`${API_URL}/my-files`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch files");

        const data = await response.json();
        setFiles(data.files);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [token]);

  const handleDownload = async (file: MediaFile) => {
    try {
      const response = await fetch(file.download_url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.original_name || file.filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      setError("Failed to download file: " + err.message);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "text_to_audio":
        return <FileText className="w-6 h-6 text-accent-cyan" />;
      case "video_to_audio":
        return <Video className="w-6 h-6 text-accent-purple" />;
      default:
        return <Music className="w-6 h-6 text-accent-pink" />;
    }
  };

  const filteredFiles = files.filter((file) => {
    const matchesSearch =
      file.original_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.filename.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || file.file_type === filterType;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-cyan"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gradient">My Files</h2>
          <p className="text-slate-400 mt-1">
            Manage your converted media files
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10 py-2"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="input-field pl-10 py-2 appearance-none cursor-pointer"
            >
              <option value="all">All Types</option>
              <option value="text_to_audio">Text to Audio</option>
              <option value="video_to_audio">Video to Audio</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-xl bg-error/10 border border-error/30 text-error animate-float">
          <div className="flex items-center gap-3">
            <span className="font-medium">{error}</span>
          </div>
        </div>
      )}

      {/* Files List */}
      <div className="space-y-4">
        {filteredFiles.length === 0 ? (
          <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10">
            <FileAudio className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-300">
              No files found
            </h3>
            <p className="text-slate-500 mt-2">
              {searchTerm || filterType !== "all"
                ? "Try adjusting your search or filters"
                : "Start converting files to see them here"}
            </p>
          </div>
        ) : (
          filteredFiles.map((file) => (
            <div
              key={file.filename}
              className="group p-4 rounded-xl bg-white/5 border border-white/10 hover:border-accent-purple/50 transition-all duration-300 hover:bg-white/[0.07]"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="p-3 rounded-lg bg-white/5 group-hover:scale-110 transition-transform duration-300">
                    {getFileIcon(file.file_type)}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-medium text-slate-200 truncate group-hover:text-accent-cyan transition-colors">
                      {file.original_name}
                    </h4>
                    <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <HardDrive className="w-3 h-3" />
                        {formatFileSize(file.file_size)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(file.created_at)}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDownload(file)}
                  className="p-2 rounded-lg text-slate-400 hover:text-accent-cyan hover:bg-accent-cyan/10 transition-all duration-300"
                  title="Download"
                >
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyFiles;
