import React, { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../service/store";
import {
  Mic,
  Languages,
  Download,
  Loader2,
  FileAudio,
  Music,
} from "lucide-react";
import API_URL from "../config";

const TextToAudio: React.FC = () => {
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("en");
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const { token } = useSelector((state: RootState) => state.auth);

  const handleConvert = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setError("");
    setAudioUrl(null);

    try {
      const response = await fetch(`${API_URL}/convert/text-to-audio`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text, language }),
      });

      if (!response.ok) throw new Error("Conversion failed");

      const data = await response.json();

      // Fetch the audio file with authentication to create a blob URL
      const audioResponse = await fetch(data.url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!audioResponse.ok) throw new Error("Failed to load audio");

      const blob = await audioResponse.blob();
      const blobUrl = URL.createObjectURL(blob);
      setAudioUrl(blobUrl);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold text-gradient">Text to Audio</h2>
        <p className="text-slate-400 text-lg">
          Transform your text into lifelike speech instantly
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Input Section */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white/5 rounded-2xl p-1 border border-white/10 focus-within:border-accent-purple/50 transition-colors">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter your text here..."
              className="w-full h-64 bg-transparent border-none resize-none p-4 text-slate-200 placeholder:text-slate-600 focus:ring-0 text-lg leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
              <Languages className="w-5 h-5 text-slate-400" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent border-none text-slate-200 focus:ring-0 cursor-pointer"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="hi">Hindi</option>
              </select>
            </div>

            <button
              onClick={handleConvert}
              disabled={loading || !text.trim()}
              className="btn-primary px-8 py-3 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Converting...
                </>
              ) : (
                <>
                  <Mic className="w-5 h-5" />
                  Convert Now
                </>
              )}
            </button>
          </div>
        </div>

        {/* Output Section */}
        <div className="md:col-span-1">
          <div className="h-full bg-slate-900/50 rounded-2xl border border-slate-800 p-6 flex flex-col items-center justify-center text-center space-y-6">
            {audioUrl ? (
              <>
                <div className="w-20 h-20 rounded-full bg-accent-cyan/10 flex items-center justify-center animate-pulse-slow">
                  <FileAudio className="w-10 h-10 text-accent-cyan" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-white">
                    Ready to Play
                  </h3>
                  <p className="text-sm text-slate-400">
                    Your audio has been generated successfully
                  </p>
                </div>
                <div className="w-full space-y-4">
                  <audio src={audioUrl} controls className="w-full" />
                  <a
                    href={audioUrl}
                    download="converted-audio.mp3"
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
                  <Music className="w-10 h-10 text-slate-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-slate-300">
                    No Audio Yet
                  </h3>
                  <p className="text-sm text-slate-500">
                    Enter text and click convert to generate audio
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

export default TextToAudio;
