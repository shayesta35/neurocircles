"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
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
  Badge,
  Stack,
} from "@chakra-ui/react"

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) setUser(session.user)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <Text p={10}>Loading...</Text>

  if (!user) {
    window.location.href = "/login"
    return null
  }

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
            <Button colorScheme="blue" w="full" as="a" href="/add-child">
              ➕ Add Child
            </Button>
          </CardFooter>
        </Card>

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
            <Button colorScheme="purple" w="full" as="a" href="/find-match">
              🔍 Find Match
            </Button>
          </CardFooter>
        </Card>

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
            <Button colorScheme="green" w="full" as="a" href="/my-kids">
              👨‍👩‍👧 View Kids
            </Button>
          </CardFooter>
        </Card>

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
