"use client";

import { useActionState } from "react";
import { register } from "@/actions/auth.action"; // Update to your register action

export default function RegisterForm() {
  const [state, action, pending] = useActionState(register, undefined);

  console.log(state);

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
          className="mt-1 block w-full rounded-md border border-my-paragraph px-3 py-2 text-my-paragraph shadow-sm focus:border-my-accent-one focus:outline-none focus:ring-1 focus:ring-my-accent-one"
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

      {/* Confirm Password Field */}
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-my-headline">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="Confirm your password"
          className="mt-1 block w-full rounded-md border border-my-paragraph px-3 py-2 text-my-paragraph shadow-sm focus:border-my-accent-one focus:outline-none focus:ring-1 focus:ring-my-accent-one"
        />
        {state?.errors?.confirmPassword && (
          <p className="mt-1 text-sm text-my-accent-two">{state.errors.confirmPassword}</p>
        )}
      </div>

      {/* Role Select Field */}
      <div>
        <label htmlFor="role" className="block text-sm font-medium text-my-headline">
          Role
        </label>
        <select
          id="role"
          name="role"
          className="mt-1 block w-full rounded-md border border-my-paragraph px-3 py-2 text-my-paragraph shadow-sm focus:border-my-accent-one focus:outline-none focus:ring-1 focus:ring-my-accent-one"
          defaultValue="TEAM"
        >
          <option value="TEAM">Team</option>
          <option value="LEAD">Lead</option>
        </select>
        {state?.errors?.role && (
          <p className="mt-1 text-sm text-my-accent-two">{state.errors.role}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={pending}
        className="flex w-full justify-center rounded-md border border-transparent bg-my-accent-one px-4 py-2 text-sm font-medium text-my-bg shadow-sm hover:bg-my-accent-one/80 focus:outline-none focus:ring-2 focus:ring-my-accent-one focus:ring-offset-2 disabled:opacity-50"
      >
        {pending ? "Registering..." : "Register"}
      </button>
    </form>
  );
}
