import React, { useState } from "react"
import { useNavigate } from "react-router-dom"

const Login = () => {
  const [isRegister, setIsRegister] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    registerNo: "",
    department: "",
    mobile: "",
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = isRegister
        ? "http://localhost:5000/api/auth/register"
        : "http://localhost:5000/api/auth/login"

      const body = isRegister
        ? {
            fullName: form.fullName,   // ✅ FIXED
            email: form.email,
            password: form.password,
            registerNo: form.registerNo,
            department: form.department,
            mobile: form.mobile,
          }
        : {
            email: form.email,
            password: form.password,
          }

      if (isRegister && form.password !== form.confirmPassword) {
        alert("Passwords do not match")
        setLoading(false)
        return
      }

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.message || "Something went wrong")
        setLoading(false)
        return
      }

      localStorage.setItem("user", JSON.stringify(data.user))
      navigate("/dashboard")

    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      alert("Server error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md bg-white border border-black rounded-2xl shadow-lg p-8">

        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-slate-800 border border-black flex items-center justify-center text-white text-xl font-bold mb-2">
            SD
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            Skill Development Tracker
          </h2>
          <p className="text-slate-600 mt-1">
            {isRegister ? "Create a new account" : "Sign in to your account"}
          </p>
        </div>

        <div className="flex mb-6 border border-black rounded-lg overflow-hidden">
          <button
            onClick={() => setIsRegister(false)}
            className={`flex-1 py-2 font-medium ${
              !isRegister ? "bg-slate-400 text-white" : "bg-white text-black"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsRegister(true)}
            className={`flex-1 py-2 font-medium ${
              isRegister ? "bg-slate-400 text-white" : "bg-white text-black"
            }`}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <>
              <Input
                label="Full Name"
                name="fullName"   // ✅ FIXED
                value={form.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
              />
              <Input
                label="Register No"
                name="registerNo"
                value={form.registerNo}
                onChange={handleChange}
                placeholder="Enter your Register Number"
              />
              <Input
                label="Department"
                name="department"
                value={form.department}
                onChange={handleChange}
                placeholder="Enter your Department"
              />
              <Input
                label="Mobile Number"
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                placeholder="Enter your Mobile Number"
              />
            </>
          )}

          <Input
            label="Email Address"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="student@college.edu"
          />

          <Input
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder={isRegister ? "Create a password" : "Enter your password"}
          />

          {isRegister && (
            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
            />
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-800 text-white py-2 rounded-xl font-semibold border border-black hover:opacity-90 transition"
          >
            {loading
              ? "Please wait..."
              : isRegister
              ? "Create Account"
              : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-600 mt-6">
          {isRegister ? "Already have an account?" : "Don’t have an account?"}
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-blue-500 font-medium hover:underline ml-1"
          >
            {isRegister ? "Sign In" : "Register"}
          </button>
        </p>
      </div>
    </div>
  )
}

const Input = ({ label, name, type = "text", value, onChange, placeholder }) => (
  <div>
    <label className="block text-sm font-medium text-slate-700 mb-1">
      {label}
    </label>
    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required
      className="w-full px-4 py-2 border border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
  </div>
)

export default Login
