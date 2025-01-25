import { LoaderCircleIcon } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-my-bg">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <LoaderCircleIcon className="h-12 w-12 text-my-accent-one" />
        <p className="font-semibold text-my-paragraph">Fetching Dashboard Data...</p>
      </div>
    </div>
  );
}
