"use client"; // Mark this as a Client Component

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  // Define the logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      return response.json();
    },
    onSuccess: () => {
      // Redirect to the login page after successful logout
      router.push("/login");
    },
    onError: (error) => {
      console.error("Logout error:", error);
    },
  });

  return (
    <div>
      <h1>Hello Dashboard</h1>
      <button
        onClick={() => logoutMutation.mutate()}
        disabled={logoutMutation.isPending}
        style={{
          padding: "8px 16px",
          backgroundColor: "#ff4d4f",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          opacity: logoutMutation.isPending ? 0.7 : 1,
        }}
      >
        {logoutMutation.isPending ? "Logging out..." : "Logout"}
      </button>
    </div>
  );
}
