"use client";

import { ComponentPropsWithoutRef, useState } from "react";
import { logout } from "../actions/auth.action";
import { LoaderCircleIcon, LogOutIcon } from "lucide-react";

type LogoutButtonProps = ComponentPropsWithoutRef<"button">;

export default function LogoutButton({ className, ...props }: LogoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className={`flex items-center rounded-md border border-my-accent-one px-4 py-2 text-my-paragraph hover:text-my-accent-one ${
        isLoading ? "cursor-not-allowed opacity-50" : ""
      } ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center">
          <LoaderCircleIcon className="me-2 h-5 w-5 animate-spin" />
          Logging out...
        </span>
      ) : (
        <span className="flex items-center">
          <LogOutIcon className="me-2 h-5 w-5" />
          Logout
        </span>
      )}
    </button>
  );
}
