"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  Flex,
  Spinner,
} from "@chakra-ui/react";
import Link from "next/link";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function MyKidsPage() {
  const supabase = createClientComponentClient();
  const [kids, setKids] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log("MyKidsPage component loaded");

  useEffect(() => {
    async function loadKids() {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
    const session = await supabase.auth.getSession();
    console.log("Session:", session);

      console.log("Supabase user:", user);
      console.log("Supabase error:", userError);

      if (!user) {
        setKids([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("nctable")
        .select("*")
        .eq("parent_id", user.id)
        .order("created_at", { ascending: true });

      console.log("Kids data:", data);
      console.log("Kids error:", error);

      if (!error) setKids(data || []);
      setLoading(false);
    }

    loadKids();
  }, []);

  return (
    <Box p={6}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">My Kids</Heading>

        <Link href="/add-child">
          <Button colorScheme="blue">Add Child</Button>
        </Link>
      </Flex>

      {loading ? (
        <Flex justify="center" mt={10}>
          <Spinner size="xl" />
        </Flex>
      ) : kids.length === 0 ? (
        <Text>No kids added yet. Click “Add Child” to get started.</Text>
      ) : (
        <>
          <h2>Your Kids</h2>

          {kids.map((k) => (
            <div key={k.id} style={{ marginBottom: "12px" }}>
              <strong>{k.name}</strong> — Age {k.age}
            </div>
          ))}
        </>
      )}
    </Box>
  );
}
