import prisma from '@/lib/db'

export async function getParentNotifications(parentId, { profileId, limit = 20 } = {}) {
  const rows = await prisma.parentNotification.findMany({
    where: {
      parentId,
      ...(profileId ? { profileId } : {}),
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  })

  if (rows.length) {
    return rows.map(row => ({
      id: row.id,
      type: row.type,
      title: row.title,
      body: row.body,
      at: row.createdAt.toISOString(),
      read: row.read,
    }))
  }

  return []
}
