"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

export default function FindMatch() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const [user, setUser] = useState(null);
  const [children, setChildren] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Clean array values from PostgreSQL formatting
  const cleanArray = (arr) =>
    Array.isArray(arr)
      ? arr.map((x) =>
          typeof x === "string"
            ? x.replace(/[{}"]/g, "").trim().toLowerCase()
            : ""
        )
      : [];

  // Matching logic
  useEffect(() => {
    if (!user) return;

    async function fetchKids() {
      const { data: myKids } = await supabase
        .from("nctable")
        .select("*")
        .eq("parent_id", user.id);

      const { data: allKids } = await supabase.from("nctable").select("*");

      const fuzzyMatch = (a, b) => {
        if (!a || !b) return false;
        if (a === b) return true;
        if (a.includes(b) || b.includes(a)) return true;
        if (a.startsWith(b) || b.startsWith(a)) return true;
        return false;
      };

      const results = [];

      myKids.forEach((myKid) => {
        const myInterests = cleanArray(myKid.interests);

        allKids.forEach((other) => {
          if (other.id === myKid.id) return;
          if (other.parent_id === user.id) return;

          const otherInterests = cleanArray(other.interests);

          const shared = [];

          myInterests.forEach((mi) => {
            otherInterests.forEach((oi) => {
              if (fuzzyMatch(mi, oi)) {
                shared.push(mi);
              }
            });
          });

          if (shared.length > 0) {
            results.push({
              myKid,
              other,
              score: shared.length,
              shared,
            });
          }
        });
      });

      setChildren(myKids || []);
      setMatches(results);
    }

    fetchKids();
  }, [user]);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      window.location.href = "/login";
    }
  }, [loading, user]);

  if (loading) {
    return <p style={{ padding: 40 }}>Loading...</p>;
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Find a Match</h1>

      <h2 style={{ marginTop: 30 }}>Matches Found</h2>

      {matches.length === 0 ? (
        <p>No matches yet.</p>
      ) : (
        matches.map((m, i) => (
          <div key={i} style={{ marginBottom: 20 }}>
            <strong>{m.myKid.name}</strong> matches with{" "}
            <strong>{m.other.name}</strong>
            <br />
            Shared interests: {m.shared.join(", ")}
            <br />
            Compatibility Score: {m.score}
          </div>
        ))
      )}
    </div>
  );
}
