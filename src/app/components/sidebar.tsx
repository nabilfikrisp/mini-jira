"use client";

import { useState } from "react";
import { X, LogsIcon, HomeIcon, ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/logout-button";

const SIDEBAR_ITEMS = [
  {
    icon: HomeIcon,
    text: "Dashboard",
    href: "/",
  },
  {
    icon: LogsIcon,
    text: "Logs",
    href: "/logs",
  },
];

type SidebarProps = { username: string };
export default function Sidebar({ username }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false); // Closed by default on mobile
  const pathname = usePathname();

  function closeSidebar() {
    setIsOpen(false);
  }

  function openSidebar() {
    setIsOpen(true);
  }

  return (
    <>
      {/* Sidebar Toggle Button (Mobile Only) */}
      {!isOpen && (
        <button
          onClick={openSidebar}
          aria-label="Toggle sidebar"
          className="fixed left-0 top-5 z-50 rounded-r-lg border border-l-0 border-my-paragraph bg-my-bg p-1 pl-0 text-my-paragraph hover:bg-my-accent-one hover:text-my-bg focus:outline-none lg:hidden"
        >
          <ChevronRightIcon size={18} />
        </button>
      )}

      {/* Backdrop for Mobile Only */}
      {isOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 z-40 flex h-screen flex-col overflow-hidden border-r border-r-my-paragraph bg-my-bg text-my-paragraph transition-all duration-300 ease-in-out lg:sticky lg:w-52 ${
          isOpen ? "w-52" : "w-0 lg:w-52"
        }`}
      >
        {/* Sidebar Header with Close Button (Mobile Only) */}
        <div className="flex items-center justify-between border-b border-gray-700 p-4">
          <h2 className="text-nowrap text-xl font-bold">Hi, {username}</h2>
          <button
            onClick={closeSidebar}
            aria-label="Close sidebar"
            className="rounded-lg p-1 hover:bg-my-accent-one hover:text-my-bg lg:hidden"
          >
            <X size={24} />
          </button>
        </div>

        {/* Sidebar Menu */}
        <ul className="flex flex-1 flex-col gap-1 p-2">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <li key={item.text}>
                <Link
                  href={item.href}
                  onClick={closeSidebar}
                  className={`flex items-center rounded-lg p-1 px-2 font-semibold transition-colors ${
                    isActive ? "text-my-accent-one" : "hover:text-my-accent-one"
                  }`}
                >
                  <Icon className="mr-3" size={20} />
                  <span>{item.text}</span>
                </Link>
              </li>
            );
          })}
          <li className="mt-auto">
            <LogoutButton className="w-full text-start" />
          </li>
        </ul>
      </div>
    </>
  );
}
