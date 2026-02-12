import React, { useState, useEffect } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import {
  MdAddCircle, MdSearch, MdLayers,
  MdCheckCircle, MdFormatListBulleted, MdSchool
} from "react-icons/md";

const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#3b82f6", "#10b981", "#f59e0b"];
const API = "http://localhost:5000/api/admin";

export default function Admin() {
  const [activeForm, setActiveForm] = useState("course");
  const [courses, setCourses] = useState([]);
  const [courseStats, setCourseStats] = useState([]);

  const [rollNumber, setRollNumber] = useState("");
  const [student, setStudent] = useState(null);
  const [expandedCourse, setExpandedCourse] = useState(null);


  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${API}/courses`);
      setCourses(res.data);
      const chartData = res.data.map(course => ({
        name: course.title,
        value: course.enrolledStudents || 0
      }));
      setCourseStats(chartData);
    } catch {
      console.error("Fetch Error");
    }
  };

  useEffect(() => {
    (async () => {
      await fetchCourses();
    })();
  }, []);
  // Logic to determine if a course is Ongoing or Completed
  const getNextTopicInfo = (courseId, currentTopicTitle) => {
    const dbCourse = courses.find(c => c._id === courseId);
        // Removed unused state variables: totalCourses, courseData, topicData
        // const [courseData, setCourseData] = useState({ title: "" });
        // const [topicData, setTopicData] = useState({ courseId: "", topic: "" });

    // Removed unused: totalCourses, courseData, setCourseData, topicData, setTopicData
    const currentIndex = dbCourse.topics.findIndex(t => t.title === currentTopicTitle);
    
    if (currentIndex >= dbCourse.topics.length - 1) return { next: null, isLast: true };

    return { 
        next: dbCourse.topics[currentIndex + 1].title, 
        isLast: (currentIndex + 1) === (dbCourse.topics.length - 1) 
    };
  };

  const handleSearch = async () => {
    if (!rollNumber) return;
    try {
      const res = await axios.get(`${API}/student/${rollNumber}`);
      setStudent(res.data);
    } catch {
      alert("Student not found");
      setStudent(null);
    }
  };

  const handleUpdateTopic = async (courseId, topicToSubmit) => {
    try {
      await axios.put(`${API}/update-topic`, {
        rollNumber,
        courseId,
        topic: topicToSubmit
      });
      alert(`Topic "${topicToSubmit}" marked complete!`);
      handleSearch(); // Refresh student data
      setExpandedCourse(null);
    } catch {
      alert("Update failed");
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-6 space-y-10 font-sans bg-slate-50 min-h-screen">
      
      {/* 1. TOP MANAGEMENT SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
            <h3 className="text-xs font-black uppercase tracking-widest text-indigo-500 mb-6">Course Creator</h3>
            <div className="flex gap-2 mb-6">
                <button onClick={() => setActiveForm("course")} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeForm === "course" ? "bg-indigo-600 text-white shadow-md" : "bg-slate-100 text-slate-500"}`}>+ Course</button>
                <button onClick={() => setActiveForm("topic")} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeForm === "topic" ? "bg-indigo-600 text-white shadow-md" : "bg-slate-100 text-slate-500"}`}>+ Topic</button>
            </div>
            {activeForm === "course" ? (
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <input type="text" placeholder="Course Name" className="w-full bg-slate-50 rounded-xl px-6 py-4 text-sm font-bold outline-none border border-slate-100 focus:border-indigo-300" />
                    <button className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-indigo-600">Add Course</button>
                </form>
            ) : (
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <select className="w-full bg-slate-50 rounded-xl px-6 py-4 text-sm font-bold outline-none border border-slate-100">
                        <option>Select Course</option>
                        {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
                    </select>
                    <input type="text" placeholder="Topic Title" className="w-full bg-slate-50 rounded-xl px-6 py-4 text-sm font-bold outline-none border border-slate-100" />
                    <button className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold">Add Topic</button>
                </form>
            )}
        </div>
        <div className="lg:col-span-7 bg-slate-900 rounded-3xl p-10 text-white shadow-2xl">
          <h3 className="text-xs uppercase tracking-widest text-indigo-400 mb-6 font-black">Global Enrollment Overview</h3>
          <div className="h-64"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={courseStats} innerRadius={60} outerRadius={80} dataKey="value">{courseStats.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}</Pie><Tooltip /><Legend /></PieChart></ResponsiveContainer></div>
        </div>
      </div>

      {/* 2. STUDENT SEARCH BAR */}
      <div className="bg-white rounded-4xl p-4 shadow-xl flex gap-4 max-w-2xl mx-auto border-2 border-indigo-50">
        <input 
          type="text" 
          value={rollNumber} 
          onChange={(e) => setRollNumber(e.target.value)} 
          placeholder="Enter Student Roll Number..." 
          className="flex-1 px-6 py-4 bg-transparent outline-none font-bold text-slate-700" 
        />
        <button onClick={handleSearch} className="bg-indigo-600 text-white px-8 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg"><MdSearch size={24} /></button>
      </div>

      {/* 3. SEARCH RESULTS: ONLY ONGOING AND COMPLETED COURSES */}
      {student && (
        <div className="grid lg:grid-cols-2 gap-10 animate-in fade-in slide-in-from-bottom-6 duration-500">
          
          {/* ONGOING COURSES SECTION */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 ml-2">
                <div className="w-2 h-6 bg-indigo-600 rounded-full"></div>
                <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest">Ongoing Courses</h3>
            </div>
            
            {student.ongoing?.filter(course => getNextTopicInfo(course.courseId, course.currentTopic).next !== null).map((course) => {
              const topicInfo = getNextTopicInfo(course.courseId, course.currentTopic);
              return (
                <div key={course.courseId} className="bg-white p-6 rounded-4xl shadow-xl shadow-slate-200/40 border border-slate-50">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                        <h4 className="font-black text-xl text-slate-800">{course.title}</h4>
                        <p className="text-[10px] font-bold text-indigo-500 uppercase mt-1">Status: In Progress</p>
                    </div>
                    <button 
                      onClick={() => setExpandedCourse(expandedCourse === course.courseId ? null : course.courseId)}
                      className="bg-slate-50 text-slate-600 p-2 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                    >
                      <MdLayers size={22}/>
                    </button>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Currently On:</span>
                    <p className="font-bold text-slate-700">{course.currentTopic || "Just Started"}</p>
                  </div>

                  {expandedCourse === course.courseId && (
                    <div className="mt-6 pt-6 border-t border-slate-100 space-y-4 animate-in slide-in-from-top-2">
                        <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                             <span className="text-[10px] font-black text-indigo-400 uppercase">Next Topic to Complete</span>
                             <p className="font-black text-indigo-700 text-lg">{topicInfo.next}</p>
                        </div>
                        <button 
                          onClick={() => handleUpdateTopic(course.courseId, topicInfo.next)}
                          className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-black hover:bg-emerald-600 shadow-lg shadow-emerald-100 flex items-center justify-center gap-2"
                        >
                          <MdCheckCircle size={20}/> Mark as Completed
                        </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* COMPLETED COURSES SECTION */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 ml-2">
                <div className="w-2 h-6 bg-emerald-500 rounded-full"></div>
                <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest">Completed Courses</h3>
            </div>
            
            <div className="space-y-4">
              {student.ongoing?.filter(course => {
                const info = getNextTopicInfo(course.courseId, course.currentTopic);
                return info.next === null && info.isLast === true;
              }).map((course, i) => (
                <div key={i} className="bg-white p-6 rounded-3xl flex items-center justify-between border border-emerald-100 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="bg-emerald-500 text-white p-3 rounded-2xl shadow-lg shadow-emerald-100"><MdSchool size={24} /></div>
                    <span className="font-black text-slate-700 text-lg">{course.title}</span>
                  </div>
                  <span className="text-[10px] font-black uppercase bg-emerald-50 text-emerald-600 px-4 py-2 rounded-full">Finished</span>
                </div>
              ))}
              
              {student.ongoing?.filter(course => {
                  const info = getNextTopicInfo(course.courseId, course.currentTopic);
                  return info.next === null && info.isLast === true;
              }).length === 0 && (
                <div className="text-center py-10 bg-white rounded-4xl border-2 border-dashed border-slate-100">
                    <p className="text-slate-400 font-bold italic">No courses completed yet.</p>
                </div>
              )}
            </div>
          </div>
          
        </div>
      )}
    </div>
  );
}
