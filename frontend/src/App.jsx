import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import UserDashboard from "./pages/UserDashboard";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <Routes> 
                    <Route path="/Signup" element={<Signup />} />
                    <Route path="/Login" element={<Login />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/UserDashboard" element={
                        <ProtectedRoute>
                            <UserDashboard />
                        </ProtectedRoute>
                    } />
                    <Route path="/Home" element={<Home />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;