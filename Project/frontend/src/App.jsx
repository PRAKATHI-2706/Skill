import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "./components/Login"
import Navbar from "./components/Navbar"
import StudentDashboard from "./components/StudentDashboard"
import Courses from "./components/Courses"
import Progress from "./components/Progress"
import Profile from "./components/Profile"
import Admin from "./components/Admin"


function ProtectedRoute({ children }) {
  const user = localStorage.getItem("user")
  if (!user) return <Navigate to="/login" replace />
  return children
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<Admin/>} />

        {/* LOGIN */}
        <Route path="/login" element={<Login />} />

        {/* NAVBAR LAYOUT (Protected) */}
        <Route
          element={
            <ProtectedRoute>
              <Navbar />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/profile" element={<Profile />} />
          
        </Route>

        {/* DEFAULT ROUTE */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
        
      </Routes>
    </BrowserRouter>
  )
}

export default App
