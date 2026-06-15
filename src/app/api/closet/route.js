import prisma from '@/lib/db'

// POST /api/closet - Save equipped accessories for a profile
export async function POST(request) {
  try {
    const { profileId, equippedAccessories } = await request.json()
    if (!profileId) return Response.json({ error: 'profileId required' }, { status: 400 })
    const profile = await prisma.childProfile.update({
      where: { id: profileId },
      data: { equippedAccessories: equippedAccessories || '' },
    })
    return Response.json({ equippedAccessories: profile.equippedAccessories })
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}
