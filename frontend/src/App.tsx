import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import TextToAudio from "./components/TextToAudio";
import VideoToAudio from "./components/VideoToAudio";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./components/Home";
import MyFiles from "./components/MyFiles";
import { useSelector } from "react-redux";
import type { RootState } from "./service/store";

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/text-to-audio"
          element={
            <PrivateRoute>
              <TextToAudio />
            </PrivateRoute>
          }
        />
        <Route
          path="/video-to-audio"
          element={
            <PrivateRoute>
              <VideoToAudio />
            </PrivateRoute>
          }
        />
        <Route
          path="/my-files"
          element={
            <PrivateRoute>
              <MyFiles />
            </PrivateRoute>
          }
        />
        {/* Redirect legacy routes */}
        <Route path="/video" element={<Navigate to="/video-to-audio" />} />
      </Routes>
    </Layout>
  );
}

export default App;
