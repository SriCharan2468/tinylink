import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET(request, { params }) {
  // Fix: Await the params object!
  const { code } = await params;  // <-- THIS FIXES YOUR BUG!

  const trimmed = (code ?? "").trim();
  console.log("CODE RECEIVED:", JSON.stringify(code), code?.length);

  // Regex
  if (!/^[A-Za-z0-9]{6,8}$/.test(trimmed)) {
    return new Response(
      JSON.stringify({ error: "Invalid code format" }),
      { status: 400 }
    );
  }

  const link = await prisma.link.findUnique({ where: { shortCode: trimmed } });
  if (!link) {
    return new Response(
      JSON.stringify({ error: "Short code not found" }),
      { status: 404 }
    );
  }
  return new Response(JSON.stringify({ link }), { status: 200 });
}
