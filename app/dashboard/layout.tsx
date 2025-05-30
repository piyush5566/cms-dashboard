"use client";

import SideNav from "@/app/ui/dashboard/sidenav";
import { useState, useEffect } from "react";
import clsx from "clsx";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/check");
        const data = await response.json();
        setIsLoggedIn(data.isLoggedIn);
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col md:flex-row">
      <div
        className={clsx("w-full flex-none transition-all duration-300", {
          "md:w-64": !isCollapsed,
          "md:w-20": isCollapsed,
        })}
      >
        <SideNav
          isCollapsed={isCollapsed}
          onCollapse={setIsCollapsed}
          isLoggedIn={isLoggedIn}
        />
      </div>
      <div className="flex-grow p-6 md:p-12">{children}</div>
    </div>
  );
}
