import React, { useState, useEffect } from "react"
import axios from "axios"

export default function Profile() {
  const [tab, setTab] = useState("view")
  const [completedCount, setCompletedCount] = useState(0)

  // 1. Get user from localStorage safely
  const storedUser = React.useMemo(() => JSON.parse(localStorage.getItem("user") || "null"), []);
  const user = React.useMemo(() => storedUser || {
    name: "Student",
    email: "student@school.edu",
  }, [storedUser]);

  const displayName = user.name || user.fullName || "Student";
  const initials = displayName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "S";

  // 2. Updated Fetch Logic to match Dashboard's calculation
  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (user && user._id) {
          // Fetch both lists to calculate completion status
          const [resCourses, resDashboard] = await Promise.all([
            axios.get("http://localhost:5000/api/admin/courses"),
            axios.get(`http://localhost:5000/api/student/dashboard/${user._id}`)
          ]);

          const allDbCourses = resCourses.data;
          const enrolledData = resDashboard.data.ongoing || [];

          let count = 0;
          enrolledData.forEach(enrolled => {
            const dbCourse = allDbCourses.find(c => c._id === enrolled.courseId);
            if (dbCourse && dbCourse.topics.length > 0) {
              const lastTopicTitle = dbCourse.topics[dbCourse.topics.length - 1].title;
              // If current topic is the last one, it's considered completed
              if (enrolled.currentTopic === lastTopicTitle) {
                count++;
              }
            }
          });
          setCompletedCount(count);
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };
    fetchStats();
  }, [user, user._id]);

  const [form, setForm] = useState({
    name: displayName,
    linkedin: user.linkedin || "",
    github: user.github || "",
    leetcode: user.leetcode || "",
    mobile: user.mobile || "",
  })

  const handleSave = async () => {
    try {
      const res = await axios.put("http://localhost:5000/api/auth/update-profile", {
        email: user.email,
        name: form.name,
        linkedin: form.linkedin,
        github: form.github,
        leetcode: form.leetcode,
        mobile: form.mobile,
      });
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setTab("view");
      window.location.reload();
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };
  return (
    <div className="max-w-2xl mx-auto py-10 px-6 font-sans bg-slate-900 min-h-screen rounded-3xl shadow-xl">
      <div className="flex items-center gap-6 mb-8">
        <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
          {initials}
        </div>
        <div>
          <h2 className="text-white text-xl font-semibold">{displayName}</h2>
          <p className="text-blue-100 text-sm">{user.email}</p>
        </div>
      </div>
      {/* CONTENT */}
      <div className="p-6 bg-white rounded-2xl shadow-md">
        <div className="flex gap-3 mb-6">
          <TabButton active={tab === "view"} onClick={() => setTab("view")} label="Overview" />
          <TabButton active={tab === "edit"} onClick={() => setTab("edit")} label="Edit Profile" />
        </div>
        {/* VIEW MODE */}
        {tab === "view" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <InfoCard label="Username" value={displayName} />
            <InfoCard label="Email" value={user.email} />
            <InfoCard label="Completed Courses" value={completedCount} />
            <InfoCard label="LinkedIn" value={form.linkedin || "Not added"} />
            <InfoCard label="GitHub" value={form.github || "Not added"} />
            <InfoCard label="LeetCode" value={form.leetcode || "Not added"} />
            <InfoCard label="Mobile" value={form.mobile || "Not added"} />
          </div>
        )}
        {/* EDIT MODE */}
        {tab === "edit" && (
          <div className="space-y-5">
            <Input label="Username" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <div className="text-sm text-slate-500">Email: {user.email} (cannot be changed) </div>
            <Input label="LinkedIn" value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} />
            <Input label="GitHub" value={form.github} onChange={(e) => setForm({ ...form, github: e.target.value })} />
            <Input label="LeetCode" value={form.leetcode} onChange={(e) => setForm({ ...form, leetcode: e.target.value })} />
            <Input label="Mobile Number" value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} />
            <div className="flex gap-3 pt-4">
              <button className="px-6 py-2 rounded-xl bg-slate-700 text-white text-sm font-medium hover:opacity-90 transition" onClick={handleSave}>Save Changes</button>
              <button onClick={() => setTab("view")} className="px-6 py-2 rounded-xl bg-slate-100 text-slate-700 text-sm font-medium hover:bg-slate-200 transition">Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
const TabButton = ({ active, label, onClick }) => (
  <button onClick={onClick} className={`px-4 py-2 rounded-full text-sm font-medium transition ${active ? "bg-slate-700 text-white shadow" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}>
    {label}
  </button>
);

const InfoCard = ({ label, value }) => (
  <div className="rounded-xl border border-slate-200 p-4 hover:shadow-md transition">
    <div className="text-xs text-slate-500 mb-1">{label}</div>
    <div className="text-sm font-semibold text-slate-800 truncate">{value}</div>
  </div>
);

const Input = ({ label, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
    <input value={value} onChange={onChange} className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" />
  </div>
);