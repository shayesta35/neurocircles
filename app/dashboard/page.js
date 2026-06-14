"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import Link from "next/link"
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
} from "@chakra-ui/react"

export default function Dashboard() {
  const supabase = createClientComponentClient()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load session
  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (session?.user) {
        setUser(session.user)
      }

      setLoading(false)
    }

    load()
  }, [supabase])

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      window.location.href = "/login"
    }
  }, [loading, user])

  if (loading) return <Text p={10}>Loading...</Text>

  async function logout() {
    await supabase.auth.signOut()
    window.location.href = "/login"
  }

  return (
    <Box p={10} maxW="900px" mx="auto">
      <Heading size="2xl" mb={3} color="blue.600">
        Welcome, Parent!
      </Heading>

      <Text fontSize="lg" color="gray.600" mb={10}>
        What would you like to do today?
      </Text>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>

        {/* Add Child */}
        <Card boxShadow="lg" borderRadius="xl" bg="blue.50">
          <CardHeader>
            <Heading size="md" color="blue.700">Add a Child</Heading>
          </CardHeader>
          <CardBody>
            <Text color="gray.600">
              Create a profile for your child including age and interests.
            </Text>
          </CardBody>
          <CardFooter>
            <Link href="/add-child">
              <Button colorScheme="blue" w="full">
                ➕ Add Child
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Find Match */}
        <Card boxShadow="lg" borderRadius="xl" bg="purple.50">
          <CardHeader>
            <Heading size="md" color="purple.700">Find a Match</Heading>
          </CardHeader>
          <CardBody>
            <Text color="gray.600">
              Discover children with similar interests for social connection.
            </Text>
          </CardBody>
          <CardFooter>
            <Link href="/find-match">
              <Button colorScheme="purple" w="full">
                🔍 Find Match
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {/* My Kids */}
        <Card boxShadow="lg" borderRadius="xl" bg="green.50">
          <CardHeader>
            <Heading size="md" color="green.700">My Kids</Heading>
          </CardHeader>
          <CardBody>
            <Text color="gray.600">
              View and manage your children's profiles.
            </Text>
          </CardBody>
          <CardFooter>
            <Link href="/my-kids">
              <Button colorScheme="green" w="full">
                👨‍👩‍👧 View Kids
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Logout */}
        <Card boxShadow="lg" borderRadius="xl" bg="red.50">
          <CardHeader>
            <Heading size="md" color="red.700">Logout</Heading>
          </CardHeader>
          <CardBody>
            <Text color="gray.600">
              Sign out of your account securely.
            </Text>
          </CardBody>
          <CardFooter>
            <Button colorScheme="red" w="full" onClick={logout}>
              Logout
            </Button>
          </CardFooter>
        </Card>

      </SimpleGrid>
    </Box>
  )
}
