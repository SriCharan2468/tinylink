import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function POST(request) {
  const { shortCode } = await request.json();

  const record = await prisma.link.update({
    where: { shortCode },
    data: {
      clicks: { increment: 1 },        // increment total clicks
      lastClicked: new Date(),          // update last clicked time
    },
  }).catch(() => null);

  if (record) {
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } else {
    return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });
  }
}
