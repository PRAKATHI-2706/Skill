import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  MdTimeline, 
  MdArrowBack,
  MdRadioButtonUnchecked,
  MdCheckCircle,
  MdLayers
} from "react-icons/md";

export default function Progress() {
    const [selected, setSelected] = useState(null);
    const [ongoing, setOngoing] = useState([]);
    const [courses, setCourses] = useState([]);
    const user = JSON.parse(localStorage.getItem("user") || "null");

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (user && user._id) {
                    const res = await axios.get(`http://localhost:5000/api/student/dashboard/${user._id}`);
                    setOngoing(res.data.ongoing || []);
                }
                const resCourses = await axios.get("http://localhost:5000/api/admin/courses");
                setCourses(resCourses.data);
            } catch {
                // fallback: do nothing
            }
        };
        fetchData();
    }, [user]);

    const getTopicsWithStatus = (course) => {
        if (!course.allTopics) return [];
        return course.allTopics.map((topic) => {
            if (topic === course.currentTopic) {
                return { title: topic, status: "In Progress" };
            }
            if (course.allTopics.indexOf(topic) < course.allTopics.indexOf(course.currentTopic)) {
                return { title: topic, status: "Completed" };
            }
            return { title: topic, status: "Locked" };
        });
    };

    const cardStyle = "bg-white border-2 border-slate-100 rounded-4xl p-6 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:border-indigo-100 transition-all cursor-pointer overflow-hidden";

    return (
        <div className="p-8 bg-slate-50 min-h-screen font-sans text-slate-800">
            <div className="max-w-6xl mx-auto">
                {/* PAGE HEADER */}
                <div className="mb-10 flex justify-between items-end gap-6">
                    <div>
                        <h3 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                            <MdTimeline className="text-indigo-600" size={32} /> 
                            {selected ? "Course Roadmap" : "Progress Tracker"}
                        </h3>
                        <p className="text-slate-500 font-medium">
                            {selected ? `Managing curriculum for ${selected.title}` : "Manage and discover your academic journey"}
                        </p>
                    </div>
                    {selected && (
                        <button 
                            onClick={() => setSelected(null)}
                            className="px-6 py-2 bg-white border border-slate-200 rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
                        >
                            <MdArrowBack /> Exit Progress
                        </button>
                    )}
                </div>

                {!selected ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {ongoing
                          .filter(c => {
                            const courseObj = courses.find(course => course._id === c.courseId);
                            if (!courseObj || !c.currentTopic) return false;
                            const allTopics = courseObj.topics.map(t => t.title);
                            if (!c.currentTopic || c.currentTopic === allTopics[allTopics.length - 1]) {
                              return false;
                            }
                            return true;
                          })
                          .map((c) => {
                            const courseObj = courses.find(k => k._id === c.courseId);
                            const topics = courseObj ? courseObj.topics.map(t => t.title) : c.allTopics || [];
                            
                            return (
                                <div 
                                    key={c.courseId} 
                                    onClick={() => setSelected({ ...c, topics: getTopicsWithStatus({ ...c, allTopics: topics }) })}
                                    className={`group relative ${cardStyle}`}
                                >
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-[3rem] -mr-10 -mt-10 group-hover:bg-indigo-50 transition-colors"></div>
                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                                <MdLayers size={28} />
                                            </div>
                                            {/* Progress percentage removed from here */}
                                        </div>
                                        <h4 className="text-xl font-black text-slate-800 mb-6 leading-tight">{c.title}</h4>
                                        
                                        {/* Progress Bar (Indigo Line) removed from here */}

                                        <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
                                            <span className="text-indigo-600 font-black text-sm uppercase tracking-tight">View Details</span>
                                            <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:translate-x-1 transition-transform">
                                                →
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    /* DETAIL SYLLABUS VIEW */
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-white border-2 border-slate-100 rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50">
                            
                            <div className="mb-10">
                                <span className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                                    Current Curriculum
                                </span>
                                <h4 className="text-4xl font-black text-slate-900 tracking-tight">{selected.name}</h4>
                            </div>

                            <div className="space-y-3 max-w-4xl">
                                {selected.topics.map((t, i) => (
                                    <div 
                                        key={i} 
                                        className="flex items-center justify-between p-5 rounded-3xl bg-slate-50/50 border-2 border-transparent hover:border-slate-100 hover:bg-white transition-all"
                                    >
                                        <div className="flex items-center gap-5">
                                            {t.status === 'Completed' ? (
                                                <MdCheckCircle className="text-emerald-500" size={28} />
                                            ) : t.status === 'In Progress' ? (
                                                <div className="w-6 h-6 rounded-full border-4 border-indigo-600 border-t-slate-200 animate-spin" />
                                            ) : (
                                                <MdRadioButtonUnchecked className="text-slate-300" size={28} />
                                            )}
                                            
                                            <div>
                                                <div className={`font-bold text-lg ${t.status === 'Locked' ? 'text-slate-400' : 'text-slate-800'}`}>
                                                    {t.title}
                                                </div>
                                                <div className={`text-[10px] font-black uppercase tracking-widest mt-0.5 ${
                                                    t.status === 'Completed' ? 'text-emerald-500' : 
                                                    t.status === 'In Progress' ? 'text-indigo-600' : 'text-slate-300'
                                                }`}>
                                                    {t.status}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}