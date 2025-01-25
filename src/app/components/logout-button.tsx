"use client";

import { logout } from "../actions/auth.action";

export default function LogoutButton() {
  const handleLogout = async () => {
    await logout();
  };

  return (
    <button
      onClick={handleLogout}
      className="rounded-md bg-my-accent-two px-4 py-2 text-my-bg hover:bg-my-accent-two/80"
    >
      Logout
    </button>
  );
}
