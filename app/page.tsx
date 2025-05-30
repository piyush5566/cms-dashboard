import AcmeLogo from "@/app/ui/acme-logo";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { lusitana } from "@/app/ui/fonts";

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <div className="relative h-screen">
        {/* Background with gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        </div>

        {/* Content */}
        <div className="relative flex h-full flex-col items-center justify-center px-6 md:px-24">
          <div className="mb-8">
            <AcmeLogo />
          </div>

          <div className="max-w-4xl text-center">
            <h1
              className={`${lusitana.className} mb-6 text-4xl font-bold text-white md:text-6xl`}
            >
              Welcome to SalesPro Dashboard
            </h1>
            <p className="mb-8 text-lg text-blue-100 md:text-xl">
              A comprehensive sales analytics and management platform designed
              to help you track revenue, manage invoices, and monitor customer
              relationships.
            </p>

            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 rounded-full bg-white px-8 py-3 text-sm font-medium text-blue-600 transition-all duration-200 hover:bg-blue-50 hover:scale-105 active:scale-95 active:bg-blue-100 md:text-base"
              >
                <span>Go to Dashboard</span>
                <ArrowRightIcon className="w-5" />
              </Link>
              <Link
                href="/login"
                className="flex items-center gap-2 rounded-full border border-white px-8 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-white/10 hover:scale-105 active:scale-95 active:bg-white/20 md:text-base"
              >
                <span>Log in</span>
              </Link>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl bg-white/10 p-6 backdrop-blur-sm">
              <h3 className="mb-2 text-xl font-semibold text-white">
                Analytics
              </h3>
              <p className="text-blue-100">
                Track your sales performance with real-time analytics and
                insights.
              </p>
            </div>
            <div className="rounded-xl bg-white/10 p-6 backdrop-blur-sm">
              <h3 className="mb-2 text-xl font-semibold text-white">
                Invoicing
              </h3>
              <p className="text-blue-100">
                Create and manage invoices with our streamlined invoicing
                system.
              </p>
            </div>
            <div className="rounded-xl bg-white/10 p-6 backdrop-blur-sm">
              <h3 className="mb-2 text-xl font-semibold text-white">
                Customer Management
              </h3>
              <p className="text-blue-100">
                Build stronger relationships with comprehensive customer
                tracking.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
