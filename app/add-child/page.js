"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";

export default function AddChild() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [interests, setInterests] = useState("");

  // Load user session
  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        setUser(session.user);
      }

      // Updated auth listener
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUser(session.user);
        }
        setLoading(false);
      });

      return () => subscription.unsubscribe();
    }

    load();
  }, []);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      window.location.href = "/login";
    }
  }, [loading, user]);

  if (loading) {
    return <p style={{ padding: 40 }}>Loading...</p>;
  }

  const saveChild = async () => {
    const interestArray = interests
      .split(",")
      .map((i) => i.trim())
      .filter((i) => i.length > 0);

    const { error } = await supabase.from("nctable").insert({
      parent_id: user.id,
      name,
      age: Number(age),
      interests: interestArray,
    });

    if (error) {
      console.error(error);
      alert("Error adding child.");
    } else {
      alert("Child added!");
      setName("");
      setAge("");
      setInterests("");
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Add Child</h1>

      <input
        placeholder="Child's Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ display: "block", marginBottom: 10 }}
      />

      <input
        placeholder="Age"
        value={age}
        onChange={(e) => setAge(e.target.value)}
        style={{ display: "block", marginBottom: 10 }}
      />

      <input
        placeholder="Interests (comma separated)"
        value={interests}
        onChange={(e) => setInterests(e.target.value)}
        style={{ display: "block", marginBottom: 10 }}
      />

      <button onClick={saveChild}>Save Child</button>
    </div>
  );
}
