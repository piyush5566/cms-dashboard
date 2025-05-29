"use client";

import Link from "next/link";
import NavLinks from "@/app/ui/dashboard/nav-links";
import AcmeLogo from "@/app/ui/acme-logo";
import {
  PowerIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { handleSignOut } from "@/app/lib/actions";
import clsx from "clsx";
import { useState } from "react";

interface SideNavProps {
  isCollapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
  isLoggedIn: boolean;
}

export default function SideNav({
  isCollapsed,
  onCollapse,
  isLoggedIn,
}: SideNavProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        type="button"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-4 left-4 z-50 md:hidden rounded-md bg-blue-600 p-2 text-white hover:bg-blue-700"
      >
        {isMobileMenuOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <Bars3Icon className="h-6 w-6" />
        )}
      </button>

      {/* Mobile menu */}
      <div
        className={clsx(
          "fixed inset-0 z-40 md:hidden transition-transform duration-300",
          {
            "translate-x-0": isMobileMenuOpen,
            "-translate-x-full": !isMobileMenuOpen,
          }
        )}
      >
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <div className="fixed inset-y-0 left-0 flex w-full max-w-xs flex-col bg-white">
          <div className="flex h-20 items-center justify-center bg-blue-600 px-4">
            <AcmeLogo isCollapsed={false} />
          </div>
          <div className="flex flex-1 flex-col overflow-y-auto">
            <NavLinks isCollapsed={false} />
            <div className="mt-auto">
              {isLoggedIn ? (
                <form action={handleSignOut}>
                  <button
                    type="submit"
                    className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600"
                  >
                    <PowerIcon className="w-6" />
                    <div>Sign Out</div>
                  </button>
                </form>
              ) : (
                <Link href="/login">
                  <button className="flex h-[48px] w-full items-center justify-center gap-2 rounded-md bg-blue-600 p-3 text-sm font-medium text-white hover:bg-blue-700">
                    <ArrowRightOnRectangleIcon className="w-6" />
                    <div>Log In</div>
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div
        className={clsx(
          "hidden md:flex h-full flex-col px-3 py-4 md:px-2 transition-all duration-300 relative",
          {
            "w-64": !isCollapsed,
            "w-20": isCollapsed,
          }
        )}
      >
        <Link
          className={clsx(
            "mb-2 flex h-20 items-end justify-start rounded-md bg-blue-600 p-4 md:h-40",
            {
              "justify-center": isCollapsed,
            }
          )}
          href="/"
        >
          <div
            className={clsx("text-white transition-all duration-300", {
              "w-32 md:w-40": !isCollapsed,
              "w-12": isCollapsed,
            })}
          >
            <AcmeLogo isCollapsed={isCollapsed} />
          </div>
        </Link>
        <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
          <NavLinks isCollapsed={isCollapsed} />
          <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
          {isLoggedIn ? (
            <form action={handleSignOut}>
              <button
                type="submit"
                className={clsx(
                  "flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3",
                  {
                    "justify-center": isCollapsed,
                  }
                )}
                title={isCollapsed ? "Sign Out" : undefined}
              >
                <PowerIcon className="w-6" />
                <div
                  className={clsx("transition-opacity duration-300", {
                    hidden: isCollapsed,
                    block: !isCollapsed,
                  })}
                >
                  Sign Out
                </div>
              </button>
            </form>
          ) : (
            <Link href="/login">
              <button
                className={clsx(
                  "flex h-[48px] w-full items-center justify-center gap-2 rounded-md bg-blue-600 p-3 text-sm font-medium text-white hover:bg-blue-700 md:flex-none md:justify-start md:p-2 md:px-3",
                  {
                    "justify-center": isCollapsed,
                  }
                )}
                title="Log In"
              >
                <ArrowRightOnRectangleIcon className="w-6" />
                <div
                  className={clsx("transition-opacity duration-300", {
                    hidden: isCollapsed,
                    block: !isCollapsed,
                  })}
                >
                  Log In
                </div>
              </button>
            </Link>
          )}
        </div>
        <button
          type="button"
          onClick={() => onCollapse(!isCollapsed)}
          className="absolute -right-3 top-6 z-50 flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm hover:bg-gray-50"
        >
          {isCollapsed ? (
            <ChevronRightIcon className="h-4 w-4" />
          ) : (
            <ChevronLeftIcon className="h-4 w-4" />
          )}
        </button>
      </div>
    </>
  );
}
