const normalize = arr =>
  Array.isArray(arr)
    ? arr.map(i => i.trim().toLowerCase())
    : []

    myKids.forEach(myKid => {
    const myInterests = normalize(myKid.interests)

  allKids.forEach(other => {
    if (other.id === myKid.id) return
    if (other.parent_id === user.id) return

    const otherInterests = normalize(other.interests)

    const shared = myInterests.filter(i => otherInterests.includes(i))

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
