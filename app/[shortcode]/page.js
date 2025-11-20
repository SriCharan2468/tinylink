// app/[shortCode]/page.js
import { notFound, redirect } from "next/navigation";

export default async function ShortCodeRedirect({ params }) {
  const { shortCode } = params;

  // Call your backend API to get the full URL for this shortCode
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_VERCEL_URL ? 'https://' + process.env.NEXT_PUBLIC_VERCEL_URL : 'http://localhost:3000'}/api/link?code=${shortCode}`,
    { cache: "no-store" }
  );
  if (!res.ok) return notFound();

  const { url } = await res.json();
  if (!url) return notFound();

  return redirect(url);
}
