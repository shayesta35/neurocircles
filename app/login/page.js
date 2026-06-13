"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  async function signIn() {
    setError("")
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) {
      setError(error.message)
    } else {
      window.location.href = "/dashboard"
    }
  }

  async function signUp() {
    setError("")
    const { error } = await supabase.auth.signUp({
      email,
      password
    })
    if (error) {
      setError(error.message)
    } else {
      alert("Account created! You can now log in.")
    }
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Parent Login</h1>

      <input
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={{ display: "block", marginBottom: 10 }}
      />

      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        style={{ display: "block", marginBottom: 10 }}
      />

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button onClick={signIn} style={{ marginRight: 10 }}>
        Login
      </button>

      <button onClick={signUp}>
        Create Account
      </button>
    </div>
  )
}
