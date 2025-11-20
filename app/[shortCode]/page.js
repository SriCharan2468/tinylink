// app/[shortCode]/page.js
import { notFound, redirect } from "next/navigation";

export default async function ShortCodeRedirect({ params }) {
  const { shortCode } = params;

  // Replace with your own base URL if needed!
  const apiBase =
    process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";

  const res = await fetch(
    `${apiBase}/api/link?code=${encodeURIComponent(shortCode)}`,
    { cache: "no-store" }
  );
  if (!res.ok) return notFound();

  const { url } = await res.json();
  if (!url) return notFound();

  return redirect(url);
}
