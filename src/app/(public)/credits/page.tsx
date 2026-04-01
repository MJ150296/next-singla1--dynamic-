// /pages/credits.tsx

import Link from "next/link";

export default function Credits() {
  return (
    <main className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-semibold mb-6">Image Credits</h1>

      <ul className="space-y-4 text-sm text-gray-700">
        <li>
          Home Banner: Photo by{" "}
          <a
            href="https://unsplash.com/@johndoe"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            John Doe
          </a>{" "}
          on{" "}
          <a
            href="https://unsplash.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Unsplash
          </a>
        </li>
        <li>
          Blog Thumbnail: Photo by{" "}
          <a
            href="https://pexels.com/@janesmith"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Jane Smith
          </a>{" "}
          on{" "}
          <a
            href="https://pexels.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Pexels
          </a>
        </li>
        {/* Add more entries here as needed */}
      </ul>

      <div className="mt-8">
        <Link href="/" className="text-sm text-gray-500 hover:underline">
          ← Back to Home
        </Link>
      </div>
    </main>
  );
}
