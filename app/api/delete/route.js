import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const shortCode = searchParams.get('code');

  if (!shortCode) {
    return new Response(JSON.stringify({ error: 'No code specified' }), { status: 400 });
  }

  try {
    await prisma.link.delete({
      where: { shortCode },
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Link not found or already deleted' }), { status: 404 });
  }
}
