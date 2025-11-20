import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET(request) {
  const urlObj = new URL(request.url);
  const code = urlObj.searchParams.get('code');

  let links;
  if (code) {
    links = await prisma.link.findMany({
      where: { shortCode: { contains: code } }
    });
  } else {
    links = await prisma.link.findMany();
  }

  return new Response(JSON.stringify({ links }), { status: 200 });
}
