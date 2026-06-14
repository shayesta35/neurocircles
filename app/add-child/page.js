"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function AddChild() {
  const supabase = createClientComponentClient()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const [name, setName] = useState("")
  const [age, setAge] = useState("")
  const [interests, setInterests] = useState("")

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (session?.user) {
        setUser(session.user)
      }

      const { data: listener } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          if (session?.user) {
            setUser(session.user)
          }
          setLoading(false)
        }
      )

      return () => listener.subscription.unsubscribe()
    }

    load()
  }, [])


useEffect(() => {
  if (!loading && !user) {
    window.location.href = "/login"
  }
}, [loading, user])
  if (loading)
    { return <p style={{ padding: 40 }}>Loading...</p>
    }
  const saveChild = async () => {
    const interestArray = interests
      .split(",")
      .map(i => i.trim())
      .filter(i => i.length > 0)

    const { error } = await supabase.from("nctable").insert({
      parent_id: user.id,
      name,
      age: Number(age),
      interests: interestArray
    })

    if (error) {
      console.error(error)
      alert("Error adding child.")
    } else {
      alert("Child added!")
      setName("")
      setAge("")
      setInterests("")
    }
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Add Child</h1>

      <input
        placeholder="Child's Name"
        value={name}
        onChange={e => setName(e.target.value)}
        style={{ display: "block", marginBottom: 10 }}
      />

      <input
        placeholder="Age"
        value={age}
        onChange={e => setAge(e.target.value)}
        style={{ display: "block", marginBottom: 10 }}
      />

      <input
        placeholder="Interests (comma separated)"
        value={interests}
        onChange={e => setInterests(e.target.value)}
        style={{ display: "block", marginBottom: 10 }}
      />

      <button onClick={saveChild}>
        Save Child
      </button>
    </div>
  )
}
