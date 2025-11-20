import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET(request, { params }) {
  const { code } = params;

  // Validate code format
  if (!/^[A-Za-z0-9]{6,8}$/.test(code)) {
    return new Response(JSON.stringify({ error: "Invalid code format" }), { status: 400 });
  }

  const link = await prisma.link.findUnique({
    where: { shortCode: code },
  });

  if (!link) {
    return new Response(JSON.stringify({ error: "Link not found" }), { status: 404 });
  }

  return new Response(JSON.stringify({ link }), { status: 200 });
}
