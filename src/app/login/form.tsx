"use client";

import { useActionState } from "react";
import { login } from "@/actions/auth.action";

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <form action={action} className="space-y-4">
      {/* Error Message */}
      {state?.message && <p className="text-center text-sm text-my-accent-two">{state.message}</p>}

      {/* Username Field */}
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-my-headline">
          Username
        </label>
        <input
          id="username"
          name="username"
          placeholder="Enter your username"
          className="mt-1 block w-full rounded-md border border-my-paragraph px-3 py-2 text-my-paragraph shadow-sm focus:border-my-accent-one focus:outline-none focus:ring-1 focus:ring-my-accent-one"
        />
        {state?.errors?.username && (
          <p className="mt-1 text-sm text-my-accent-two">{state.errors.username}</p>
        )}
      </div>

      {/* Password Field */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-my-headline">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Enter your password"
          className="focus:border-myaring-my-accent-one mt-1 block w-full rounded-md border border-my-paragraph px-3 py-2 text-my-paragraph shadow-sm focus:outline-none focus:ring-1 focus:ring-my-accent-one"
        />
        {state?.errors?.password && (
          <div className="mt-1 text-sm text-my-accent-two">
            <p>Password must:</p>
            <ul className="list-inside list-disc">
              {state.errors.password.map((error) => (
                <li key={error}>- {error}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={pending}
        className="flex w-full justify-center rounded-md border border-transparent bg-my-accent-one px-4 py-2 text-sm font-medium text-my-bg shadow-sm hover:bg-my-accent-one/80 focus:outline-none focus:ring-2 focus:ring-my-accent-one focus:ring-offset-2 disabled:opacity-50"
      >
        {pending ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
