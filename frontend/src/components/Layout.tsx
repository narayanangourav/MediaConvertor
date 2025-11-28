import React from "react";
import { Typography, Container } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../service/store";
import { logout } from "../service/authSlice";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="min-h-screen font-sans selection:bg-accent-purple selection:text-white">
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-space-900/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 no-underline group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-purple to-accent-pink animate-pulse-slow" />
              <Typography variant="h6" className="font-bold tracking-tight">
                <span className="bg-gradient-to-r from-accent-cyan via-accent-purple to-accent-pink bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">
                  Media
                </span>
                <span className="text-white ml-1">Converter</span>
              </Typography>
            </Link>

            <div className="flex gap-6 items-center">
              {isAuthenticated ? (
                <>
                  <Link to="/text-to-audio" className="nav-link">
                    Text to Audio
                  </Link>
                  <Link to="/video-to-audio" className="nav-link">
                    Video to Audio
                  </Link>
                  <Link to="/my-files" className="nav-link">
                    My Files
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-lg border border-white/20 text-space-300 hover:text-white hover:border-white/40 hover:bg-white/5 transition-all duration-300"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="nav-link">
                    Login
                  </Link>
                  <Link to="/signup">
                    <button className="btn-primary text-sm px-5 py-2">
                      Sign Up
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <Container maxWidth="md">
          <div className="glass-panel p-8 sm:p-12 animate-float">
            {children}
          </div>
        </Container>
      </div>
    </div>
  );
};

export default Layout;
