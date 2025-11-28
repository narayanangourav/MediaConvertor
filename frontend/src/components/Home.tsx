import React from "react";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <div className="text-center space-y-16 py-8">
      {/* Hero Section */}
      <div className="space-y-6">
        <h1 className="text-6xl font-bold text-gradient animate-float">
          Transform Your Media
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Professional grade tools to convert text to lifelike speech and
          extract crystal clear audio from videos.
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Text to Audio Card */}
        <div className="glass-card group cursor-pointer">
          <div className="relative">
            <div className="h-16 w-16 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br from-accent-purple to-accent-pink shadow-lg group-hover:animate-pulse-glow transition-all">
              <span className="text-4xl">🗣️</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              Text to Audio
            </h3>
            <p className="text-slate-400 mb-6 leading-relaxed">
              Convert articles, scripts, or notes into natural sounding audio
              files in seconds with AI-powered voice synthesis.
            </p>
            <Link to="/text-to-audio">
              <button className="btn-primary w-full group/btn">
                <span className="flex items-center justify-center gap-2">
                  Try it now
                  <svg
                    className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </span>
              </button>
            </Link>
          </div>
        </div>

        {/* Video to Audio Card */}
        <div className="glass-card group cursor-pointer">
          <div className="relative">
            <div className="h-16 w-16 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br from-accent-cyan to-accent-blue shadow-lg group-hover:animate-pulse-glow transition-all">
              <span className="text-4xl">🎬</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              Video to Audio
            </h3>
            <p className="text-slate-400 mb-6 leading-relaxed">
              Extract high-quality MP3 tracks from your favorite videos
              seamlessly with advanced audio processing.
            </p>
            <Link to="/video-to-audio">
              <button className="btn-primary w-full group/btn">
                <span className="flex items-center justify-center gap-2">
                  Try it now
                  <svg
                    className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </span>
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto pt-8">
        <div className="flex flex-col items-center gap-3 p-6 rounded-xl bg-white/5 border border-white/10">
          <div className="text-3xl">⚡</div>
          <h4 className="font-semibold text-white">Lightning Fast</h4>
          <p className="text-sm text-slate-400 text-center">
            Process your media in seconds with optimized algorithms
          </p>
        </div>
        <div className="flex flex-col items-center gap-3 p-6 rounded-xl bg-white/5 border border-white/10">
          <div className="text-3xl">🔒</div>
          <h4 className="font-semibold text-white">Secure & Private</h4>
          <p className="text-sm text-slate-400 text-center">
            Your files are encrypted and automatically deleted after processing
          </p>
        </div>
        <div className="flex flex-col items-center gap-3 p-6 rounded-xl bg-white/5 border border-white/10">
          <div className="text-3xl">🎯</div>
          <h4 className="font-semibold text-white">High Quality</h4>
          <p className="text-sm text-slate-400 text-center">
            Premium output with customizable settings for perfect results
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
