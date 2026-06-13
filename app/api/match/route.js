import { supabase } from "@/lib/supabase"

export async function GET() {
  const { data: kids } = await supabase.from("kids").select("*")

  function score(a, b) {
    const overlap = a.interests.filter(i => b.interests.includes(i))
    return overlap.length
  }

  const matches = []

  for (let i = 0; i < kids.length; i++) {
    for (let j = i + 1; j < kids.length; j++) {
      matches.push({
        kid1: kids[i],
        kid2: kids[j],
        score: score(kids[i], kids[j])
      })
    }
  }

  return Response.json(matches)
}
