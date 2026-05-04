"use client"

import { useState } from "react"

export default function RegisterPage() {

  const [nama, setNama] = useState("")
  const [nim, setNim] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (nim.length < 9) {
      setError("NIM tidak valid")
      return
    }

    if (!email.endsWith("@student.telkomuniversity.ac.id")) {
      setError("Gunakan email mahasiswa Telkom University")
      return
    }

    if (password.length < 6) {
      setError("Password minimal 6 karakter")
      return
    }

    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // send 'nama' as 'name' to the backend for consistency, or just send everything
        body: JSON.stringify({ nama, nim, email, password }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        alert("Register berhasil! Silakan login.")
        // Anda bisa tambahkan router.push('/login') di sini
        window.location.href = "/login"
      } else {
        setError(data.message || "Register gagal")
      }
    } catch (err) {
      setError("Terjadi kesalahan sistem")
    } finally {
      setLoading(false)
    }
  }
  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100">

      <div className="bg-white shadow-lg rounded-xl p-8 w-[380px]">

        <h1 className="text-2xl font-bold text-center text-red-600">
          Register Mahasiswa
        </h1>

        <p className="text-sm text-gray-500 text-center mt-2">
          Telkom University Remote Access
        </p>

        <form onSubmit={handleRegister} className="mt-6 space-y-4">

          <input
            type="text"
            placeholder="Nama Lengkap"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            className="w-full border rounded-lg p-2"
          />

          <input
            type="text"
            placeholder="NIM"
            value={nim}
            onChange={(e) => setNim(e.target.value)}
            className="w-full border rounded-lg p-2"
          />

          <input
            type="email"
            placeholder="Email Mahasiswa"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-lg p-2"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-lg p-2"
          />

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-red-600 text-white p-2 rounded-lg hover:bg-red-700"
          >
            Register
          </button>

        </form>

      </div>

    </main>
  )
}