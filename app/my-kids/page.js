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
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      console.log("Session:", session);
      console.log("Session error:", sessionError);

      const user = session?.user;
      console.log("Supabase user:", user);

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
          <Heading size="md" mb={4}>Your Kids</Heading>

          {kids.map((k) => (
            <Box key={k.id} p={4} borderWidth="1px" borderRadius="lg" mb={3}>
              <strong>{k.name}</strong> — Age {k.age}
              <br />
              <Text fontSize="sm" color="gray.600">
                Interests: {Array.isArray(k.interests) ? k.interests.join(", ") : k.interests}
              </Text>
            </Box>
          ))}
        </>
      )}
    </Box>
  );
}
