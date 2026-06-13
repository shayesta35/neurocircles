"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function FindMatch() {
  const [user, setUser] = useState(null)
  const [children, setChildren] = useState([])
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) setUser(session.user)

      const { data: listener } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          if (session?.user) setUser(session.user)
          setLoading(false)
        }
      )

      return () => listener.subscription.unsubscribe()
    }

    load()
  }, [])

  useEffect(() => {
    if (!user) return

    const fetchKids = async () => {
      const { data: myKids } = await supabase
        .from("nctable")
        .select("*")
        .eq("parent_id", user.id)

      setChildren(myKids || [])

      const { data: allKids } = await supabase
        .from("nctable")
        .select("*")

      const normalize = str =>
        typeof str === "string"
          ? str.trim().toLowerCase()
          : ""

      const fuzzyMatch = (a, b) => {
        const A = normalize(a)
        const B = normalize(b)

        if (!A || !B) return false
        if (A === B) return true
        if (A.includes(B) || B.includes(A)) return true
        if (A.startsWith(B) || B.startsWith(A)) return true

        return false
      }

      const results = []

      myKids.forEach(myKid => {
        const myInterests = Array.isArray(myKid.interests) ? myKid.interests : []

        allKids.forEach(other => {
          if (other.id === myKid.id) return
          if (other.parent_id === user.id) return

          const otherInterests = Array.isArray(other.interests) ? other.interests : []

          const shared = []

          myInterests.forEach(mi => {
            otherInterests.forEach(oi => {
              if (fuzzyMatch(mi, oi)) {
                shared.push(normalize(mi))
              }
            })
          })

          if (shared.length > 0) {
            results.push({
              myKid,
              other,
              score: shared.length,
              shared
            })
          }
        })
      })

      setMatches(results)
    }

    fetchKids()
  }, [user])

  if (loading) return <p style={{ padding: 40 }}>Loading...</p>

  if (!user) {
    window.location.href = "/login"
    return null
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Find a Match</h1>

     

      <h2 style={{ marginTop: 30 }}>Matches Found</h2>

      {matches.length === 0 && <p>No matches yet.</p>}

      {matches.map((m, i) => (
        <div key={i} style={{ marginBottom: 20 }}>
          <strong>{m.myKid.name}</strong> matches with{" "}
          <strong>{m.other.name}</strong>
          <br />
          Shared interests: {m.shared.join(", ")}
          <br />
          Compatibility Score: {m.score}
        </div>
      ))}
    </div>
  )
}