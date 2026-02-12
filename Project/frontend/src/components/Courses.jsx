import React, { useState, useEffect } from "react"
import axios from "axios"
import { MdBook, MdPlayCircleFilled, MdCheckCircle, MdLayers, MdClose } from "react-icons/md"

export default function Courses() {
    const [tab, setTab] = useState("available")
    const [courses, setCourses] = useState([])
    const [enrolled, setEnrolled] = useState([])
    const [modal, setModal] = useState(null)
    const user = JSON.parse(localStorage.getItem("user") || "null")

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resCourses = await axios.get("http://localhost:5000/api/admin/courses")
                setCourses(resCourses.data)

                if (user && user._id) {
                    const resStudent = await axios.get(`http://localhost:5000/api/student/dashboard/${user._id}`)
                    setEnrolled(resStudent.data.ongoing || [])
                }
            } catch (err) {
                console.error(err)
            }
        }
        fetchData()
    }, [user])

    const getStatus = (course) => {
        const enrolledCourse = enrolled.find(c => c.courseId === course._id)

        if (enrolledCourse && course.topics?.length > 0) {
            const lastTopicTitle = course.topics[course.topics.length - 1].title
            return enrolledCourse.currentTopic === lastTopicTitle
                ? "completed"
                : "ongoing"
        }

        return "available"
    }

    const available = courses.filter(c => getStatus(c) === "available")
    const ongoing = courses.filter(c => getStatus(c) === "ongoing")
    const completedCourses = courses.filter(c => getStatus(c) === "completed")

    const tabClass = (active) =>
        `px-6 py-2 rounded-xl font-bold text-sm transition-all duration-300 flex items-center gap-2 ${
            active
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-105"
                : "bg-white text-slate-400 hover:text-slate-600 hover:bg-slate-50"
        }`

    return (
        <div className="p-8 bg-slate-50 min-h-screen font-sans text-slate-800">
            <div className="max-w-6xl mx-auto">

                {/* HEADER */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                    <div>
                        <h3 className="text-3xl font-black text-slate-900 tracking-tight">
                            Course Explorer
                        </h3>
                        <p className="text-slate-500 font-medium">
                            Manage and discover your academic journey
                        </p>
                    </div>

                    <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200">
                        <button className={tabClass(tab === "available")} onClick={() => setTab("available")}>
                            <MdBook size={18}/> Available
                        </button>
                        <button className={tabClass(tab === "ongoing")} onClick={() => setTab("ongoing")}>
                            <MdPlayCircleFilled size={18}/> Ongoing
                        </button>
                        <button className={tabClass(tab === "completed")} onClick={() => setTab("completed")}>
                            <MdCheckCircle size={18}/> Completed
                        </button>
                    </div>
                </div>

                {/* COURSE GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {(tab === "available"
                        ? available
                        : tab === "ongoing"
                        ? ongoing
                        : completedCourses
                    ).map((c) => (

                        <div
                            key={c._id}
                            className="group relative bg-white border-2 border-slate-100 rounded-4xl p-6 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:border-indigo-100 transition-all cursor-pointer overflow-hidden"
                            onClick={() => tab === "available" && setModal(c)}
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-[3rem] -mr-10 -mt-10 group-hover:bg-indigo-50 transition-colors"></div>

                            <div className="relative z-10">
                                <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                    <MdLayers size={28} />
                                </div>

                                <h4 className="text-xl font-black text-slate-800 mb-2 leading-tight">
                                    {c.title}
                                </h4>

                                {/* ONLY TOPIC COUNT — LEVEL REMOVED */}
                                <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                    <span>{c.topics?.length || 0} Topics</span>
                                </div>

                                {tab === "available" && (
                                    <div className="mt-8 pt-4 border-t border-slate-50 flex justify-between items-center text-indigo-600 font-black text-sm uppercase">
                                        <span>Enroll Now</span>
                                        <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                                            →
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* MODAL */}
                {modal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                            onClick={() => setModal(null)}
                        ></div>

                        <div className="relative bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl animate-in fade-in zoom-in duration-300">
                            <button
                                className="absolute top-6 right-6 text-slate-400 hover:text-slate-900"
                                onClick={() => setModal(null)}
                            >
                                <MdClose size={24} />
                            </button>

                            <div className="text-center">
                                <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                    <MdBook size={40} />
                                </div>

                                <h4 className="text-2xl font-black text-slate-900 mb-2">
                                    {modal.title}
                                </h4>

                                <p className="text-slate-500 font-medium mb-8 px-4">
                                    Ready to start {modal.title}? Track your journey in the "Ongoing" tab.
                                </p>

                                <div className="flex flex-col gap-3">
                                    <button
                                        className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg"
                                        onClick={async () => {
                                            try {
                                                await axios.post(
                                                    "http://localhost:5000/api/admin/enroll-student",
                                                    {
                                                        studentId: user._id,
                                                        courseId: modal._id
                                                    }
                                                )

                                                const res = await axios.get(
                                                    `http://localhost:5000/api/student/dashboard/${user._id}`
                                                )

                                                setEnrolled(res.data.ongoing || [])
                                                setModal(null)
                                            } catch {
                                                alert("Enrollment failed")
                                            }
                                        }}
                                    >
                                        Confirm Registration
                                    </button>

                                    <button
                                        className="w-full py-4 bg-slate-50 text-slate-500 rounded-2xl font-bold"
                                        onClick={() => setModal(null)}
                                    >
                                        Maybe Later
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
