import React from "react"
import { useNavigate, Outlet, useLocation } from "react-router-dom"
import { MdDashboard, MdMenuBook, MdTimeline, MdLogout } from "react-icons/md"

const MenuItem = ({ label, icon, path }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const isActive = location.pathname === path

  return (
    <div
      onClick={() => navigate(path)}
      className={`flex items-center gap-4 px-6 py-4 cursor-pointer transition-all duration-300 group
        ${isActive 
          ? "bg-slate-800 border-r-4 border-indigo-500 text-white shadow-[inset_10px_0_15px_-10px_rgba(79,70,229,0.3)]" 
          : "text-slate-400 hover:bg-slate-800/50 hover:text-white"}`}
    >
      <span className={`text-2xl transition-transform group-hover:scale-110 ${isActive ? "text-indigo-500" : ""}`}>
        {icon}
      </span>
      <span className={`text-[11px] font-black uppercase tracking-[0.2em] ${isActive ? "opacity-100" : "opacity-70"}`}>
        {label}
      </span>
    </div>
  )
}

export default function Navbar() {
  const navigate = useNavigate()
  
  // Get user from localStorage safely
  const storedUser = localStorage.getItem("user")
  const user = storedUser ? JSON.parse(storedUser) : { name: "Student" }

  // Use fullName or name, fallback to Student
  const displayName = user.fullName || user.name || "Student"
  // Extract the first initial and ensure it's uppercase
  const userInitial = displayName.charAt(0).toUpperCase()
  // Extract first name for the welcome message
  const firstName = displayName.split(' ')[0]

  const handleLogout = () => {
    localStorage.removeItem("user")
    navigate("/login")
  }

  return (
    <div className="flex w-screen h-screen overflow-hidden bg-slate-50 font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#0f172a] text-white flex flex-col shadow-2xl z-20">
        <div className="flex items-center gap-4 p-8 mb-4">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <MdTimeline size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-[10px] font-black tracking-[0.3em] text-indigo-400 leading-none mb-1">SKILL</h1>
            <h1 className="text-sm font-black tracking-widest leading-none text-white">TRACKER</h1>
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <MenuItem label="Dashboard" icon={<MdDashboard />} path="/dashboard" />
          <MenuItem label="Course Explorer" icon={<MdMenuBook />} path="/courses" />
          <MenuItem label="My Progress" icon={<MdTimeline />} path="/progress" />
        </div>

        <div
          onClick={handleLogout}
          className="p-8 border-t border-slate-800 flex items-center gap-4 text-slate-500 hover:text-red-400 hover:bg-red-500/5 transition-all cursor-pointer"
        >
          <MdLogout size={22} />
          <span className="text-[11px] font-black uppercase tracking-[0.2em]">Sign Out</span>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex flex-col flex-1">
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-10">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Welcome, {firstName}
            </h2>
          </div>

          {/* PROFILE PILL */}
          <div
            onClick={() => navigate("/profile")}
            className="flex items-center gap-3 pl-2 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-full hover:border-indigo-300 transition-all cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-black group-hover:bg-indigo-600 transition-colors">
              {userInitial}
            </div>
            <span className="text-xs font-black text-slate-700 tracking-tight">
              {displayName}
            </span>
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-slate-50 p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}