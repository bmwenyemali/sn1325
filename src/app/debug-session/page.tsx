"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

export default function DebugSessionPage() {
  const { data: session, status } = useSession();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
            Session Debug Page
          </h1>

          <div className="mb-6">
            <Link
              href="/"
              className="text-bleu-rdc dark:text-jaune-rdc hover:underline"
            >
              ← Back to Home
            </Link>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
                Status:
              </h2>
              <p className="text-lg font-mono bg-gray-100 dark:bg-slate-700 p-3 rounded">
                {status}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
                Full Session Object:
              </h2>
              <pre className="bg-gray-100 dark:bg-slate-700 p-4 rounded overflow-auto text-sm">
                {JSON.stringify(session, null, 2)}
              </pre>
            </div>

            {session?.user && (
              <>
                <div>
                  <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
                    User Email:
                  </h2>
                  <p className="text-lg font-mono bg-gray-100 dark:bg-slate-700 p-3 rounded">
                    {session.user.email}
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
                    User Role:
                  </h2>
                  <p className="text-lg font-mono bg-gray-100 dark:bg-slate-700 p-3 rounded">
                    {session.user.role || "NO ROLE FOUND"}
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
                    User Name:
                  </h2>
                  <p className="text-lg font-mono bg-gray-100 dark:bg-slate-700 p-3 rounded">
                    {session.user.name || "NO NAME"}
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
                    Menu Visibility Check:
                  </h2>
                  <div className="bg-gray-100 dark:bg-slate-700 p-4 rounded space-y-2">
                    <p>
                      <strong>
                        session?.user?.role === &quot;ADMIN&quot;:
                      </strong>{" "}
                      {String(session.user.role === "ADMIN")}
                    </p>
                    <p>
                      <strong>
                        session?.user?.role === &quot;VISITOR&quot;:
                      </strong>{" "}
                      {String(session.user.role === "VISITOR")}
                    </p>
                    <p>
                      <strong>typeof session.user.role:</strong>{" "}
                      {typeof session.user.role}
                    </p>
                  </div>
                </div>
              </>
            )}

            {!session && status === "unauthenticated" && (
              <div className="bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-400 dark:border-yellow-600 p-4 rounded">
                <p className="text-yellow-800 dark:text-yellow-200">
                  You are not logged in. Please{" "}
                  <Link href="/auth/signin" className="underline font-semibold">
                    sign in
                  </Link>{" "}
                  first.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
