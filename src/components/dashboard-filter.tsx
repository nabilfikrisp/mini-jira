"use client";

import { ChevronDownIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function DashboardFilter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const filter = searchParams.get("filter");
  const validFilter = filter === "my-task" ? "my-task" : "all-task";

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(name, value);

    return params.toString();
  };

  function handleFilterChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newFilter = e.target.value;

    if (newFilter === "all-task") {
      router.push(pathname);
      return;
    }

    router.push(pathname + "?" + createQueryString("filter", newFilter));
    return;
  }

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="filter" className="text-my-paragraph">
        Filter by:
      </label>
      <div className="relative flex-1">
        {/* Select Element */}
        <select
          id="filter"
          value={validFilter} // Set the selected value based on the current filter
          onChange={handleFilterChange} // Handle filter changes
          className="w-full appearance-none rounded-lg border border-my-paragraph bg-my-bg px-3 py-2 pr-8 text-my-paragraph focus:border-my-accent-one focus:outline-none"
        >
          <option value="all-task">All Task</option>
          <option value="my-task">My Task</option>
        </select>

        {/* Custom Dropdown Icon */}
        <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
          <ChevronDownIcon className="h-5 w-5 text-my-paragraph" />
        </div>
      </div>
    </div>
  );
}
