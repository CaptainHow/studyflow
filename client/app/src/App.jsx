import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { AuthProvider } from "./context/AuthContext";
import NotFound from "./components/NotFound";

// Lazy load pages for better performance (Sustainability: Code Splitting)
// This addresses "Reduce unused JavaScript" by only loading code for the current page
const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const CoursePage = lazy(() => import("./pages/CoursePage"));
const Register = lazy(() => import("./pages/Register"));
const ProtectedRoute = lazy(() => import("./components/ProtectedRoute"));

// Simple loading component
const Loading = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/course/:id"
              element={
                <ProtectedRoute>
                  <CoursePage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
