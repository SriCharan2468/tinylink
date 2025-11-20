import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function POST(request) {
  const { url } = await request.json();
  let shortCode = Math.random().toString(36).substring(2, 8);

  // Ensure shortCode is unique
  while (await prisma.link.findUnique({ where: { shortCode } })) {
    shortCode = Math.random().toString(36).substring(2, 8);
  }

  await prisma.link.create({
    data: { url, shortCode },
  });

  return Response.json({ shortCode });
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const shortCode = searchParams.get("code");
  const record = await prisma.link.findUnique({ where: { shortCode } });
  if (record) {
    return Response.json({ url: record.url });
  } else {
    return Response.json({ error: "Not found" }, { status: 404 });
  }
}
