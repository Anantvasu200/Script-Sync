import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import LandingPage from "./components/LandingPage";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import WritePost from "./components/WritePost";
import ReadBlogPage from "./components/ReadBlogPage";
import ReadFullComponent from "./components/ReadFullBlog";
import UserPage from "./components/UserPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  // Check for existing user session on app load
  useEffect(() => {
    const checkUserSession = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Verify token with backend and get user data
          const response = await fetch('http://localhost:5000/api/verify-token', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            const userData = await response.json();
            setCurrentUser(userData.user);
          } else {
            // Token is invalid, remove it
            localStorage.removeItem('token');
          }
        } catch (error) {
          console.error('Error verifying token:', error);
          localStorage.removeItem('token');
        }
      }
    };

    checkUserSession();
  }, []);

  return (
    <BrowserRouter>
      <Navbar currentUser={currentUser} setCurrentUser={setCurrentUser} />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        style={{ marginTop: "60px", zIndex: 99999 }}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage setCurrentUser={setCurrentUser} />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route
          path="/write"
          element={
            <ProtectedRoute currentUser={currentUser}>
              <WritePost currentUser={currentUser} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user"
          element={
            <ProtectedRoute currentUser={currentUser}>
              <UserPage currentUser={currentUser} />
            </ProtectedRoute>
          }
        />

        <Route path="/read-blogs" element={<ReadBlogPage />} />
        <Route path="/read-blogs/:id" element={<ReadFullComponent />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;