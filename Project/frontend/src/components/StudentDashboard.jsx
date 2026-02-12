import React, { useEffect, useState, useMemo } from "react"
import axios from "axios"
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"
import { MdEmail, MdPhone, MdSchool, MdBarChart, MdCheckCircle } from "react-icons/md"

const COLORS = {
  Available: "#93c5fd",
  Ongoing: "#a78bfa",
  Completed: "#86efac",
}

export default function StudentDashboard() {
  const user = useMemo(() => JSON.parse(localStorage.getItem("user") || "null") || {}, [])
  const [ongoing, setOngoing] = useState([])
  const [completed, setCompleted] = useState([])
  const [allCourses, setAllCourses] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resCourses = await axios.get("http://localhost:5000/api/admin/courses")
        const allDbCourses = resCourses.data
        setAllCourses(allDbCourses)

        if (user && user._id) {
          const resDashboard = await axios.get(`http://localhost:5000/api/student/dashboard/${user._id}`)
          const enrolledData = resDashboard.data.ongoing || []

          const tempOngoing = []
          const tempCompleted = []

          enrolledData.forEach(enrolled => {
            const dbCourse = allDbCourses.find(c => c._id === enrolled.courseId)
            if (dbCourse && dbCourse.topics.length > 0) {
              const lastTopicTitle = dbCourse.topics[dbCourse.topics.length - 1].title
              if (enrolled.currentTopic === lastTopicTitle) {
                tempCompleted.push(dbCourse.title)
              } else {
                tempOngoing.push(dbCourse.title)
              }
            }
          })
          setOngoing(tempOngoing)
          setCompleted(tempCompleted)
        }
      } catch (err) {
        console.error("Error fetching dashboard:", err)
      }
    }
    fetchData()
  }, [user])

  const total = allCourses.length
  const ongoingCount = ongoing.length
  const completedCount = completed.length
  const availableCount = total - ongoingCount - completedCount
  const overallProgress = total > 0 ? Math.round((completedCount / total) * 100) : 0

  const barData = [
    { name: "Available", count: availableCount },
    { name: "Ongoing", count: ongoingCount },
    { name: "Completed", count: completedCount },
  ]

  const cardStyle = "border-2 border-slate-100 rounded-3xl bg-white shadow-xl shadow-slate-200/50 overflow-hidden"

  return (
    <div className="p-8 space-y-10 bg-slate-50 min-h-screen font-sans text-slate-800">
      <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-stretch justify-between gap-8">
        {/* STUDENT PROFILE CARD */}
        <div className={`w-full lg:w-1/2 p-10 relative bg-white ${cardStyle}`}>
          <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-50 rounded-bl-full -mr-10 -mt-10 z-0"></div>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
            <div className="w-28 h-28 shrink-0 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-5xl font-black shadow-xl shadow-indigo-200">
              {user.fullName ? user.fullName[0].toUpperCase() : "S"}
            </div>
            <div className="flex flex-col flex-1">
              <h2 className="text-5xl font-black tracking-tighter text-slate-900 mb-4">{user.fullName || "Student Name"}</h2>
              <div className="flex items-center gap-2 mb-6 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-xl w-fit">
                <MdCheckCircle className="text-emerald-500" size={20} />
                <span className="text-sm font-bold text-emerald-700">{completedCount} Courses Completed</span>
              </div>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-400">
                  <MdEmail className="text-indigo-400" size={18} /> {user.email}
                </div>
                <div className="flex items-center gap-2 text-sm font-bold text-slate-400">
                  <MdSchool className="text-indigo-400" size={18} /> {user.department}
                </div>
                <div className="flex items-center gap-2 text-sm font-bold text-slate-400">
                  <MdPhone className="text-indigo-400" size={18} /> {user.mobile}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BAR CHART CARD */}
        <div className={`w-full lg:w-1/2 p-8 bg-white ${cardStyle}`}>
          <div className="flex items-center gap-2 mb-6">
             <MdBarChart className="text-indigo-500" size={24} />
             <h3 className="font-black uppercase tracking-widest text-xs text-slate-400">Course Distribution</h3>
          </div>
          <div className="h-55">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 700, fontSize: 12}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '12px' }} />
                <Bar dataKey="count" barSize={50} radius={[10, 10, 0, 0]}>
                  {barData.map((entry) => (<Cell key={entry.name} fill={COLORS[entry.name]} />))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* SUMMARY STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {[{ label: "Total Courses", val: total, color: "text-slate-800" }, { label: "Ongoing", val: ongoingCount, color: "text-indigo-500" }, { label: "Completed", val: completedCount, color: "text-emerald-500" }].map((stat, i) => (
          <div key={i} className={`p-8 text-center bg-white ${cardStyle}`}>
            <div className={`text-4xl font-black ${stat.color} mb-1`}>{stat.val}</div>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* OVERALL PROGRESS */}
      <div className={`max-w-6xl mx-auto p-10 bg-white ${cardStyle}`}>
        <div className="flex justify-between items-end mb-6">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Academic Journey</p>
            <h3 className="text-2xl font-black text-slate-800">Overall Progress</h3>
          </div>
          <span className="text-4xl font-black text-indigo-600">{overallProgress}%</span>
        </div>
        <div className="w-full bg-slate-100 h-7 rounded-2xl overflow-hidden p-1.5 shadow-inner">
          <div className="bg-linear-to-r from-indigo-400 to-emerald-400 h-full rounded-xl transition-all duration-1000 ease-out" style={{ width: `${overallProgress}%` }} />
        </div>
      </div>
    </div>
  )
}