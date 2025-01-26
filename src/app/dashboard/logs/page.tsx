import { getUser } from "@/lib/data-access-layer";
import { getAllTaskLogsDTO, getAllUsersDTO } from "@/lib/data-transfer-object";
import { redirect } from "next/navigation";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Link from "next/link";

export default async function LogsPage() {
  const user = await getUser();
  const users = await getAllUsersDTO();
  const logs = await getAllTaskLogsDTO();

  if (!user) {
    redirect("/login");
  }

  if (logs === null) {
    return (
      <div className="flex h-full flex-col">
        <h1 className="mb-6 text-2xl font-bold text-my-headline">Task Logs</h1>
        <p className="text-my-paragraph">Error fetching task logs. Please try again later.</p>
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="flex h-full flex-col">
        <h1 className="mb-6 text-2xl font-bold text-my-headline">Task Logs</h1>
        <p className="text-my-paragraph">No task logs found.</p>
      </div>
    );
  }

  function getUsernameById(id: number) {
    return users.filter((u) => u.id === id)[0].username;
  }

  return (
    <div className="flex h-full flex-col pl-5 pr-2 pt-5">
      {/* Back Button */}
      <Link
        href="/dashboard"
        className="mb-6 flex w-fit items-center rounded-md border border-my-accent-one px-4 py-2 text-sm font-medium text-my-paragraph hover:bg-my-accent-one/10"
      >
        <ChevronLeftIcon size={16} className="mr-1 inline-block" />
        Back to Dashboard
      </Link>

      {/* Page Title */}
      <h1 className="mb-6 text-2xl font-bold text-my-headline">Task Logs</h1>

      {/* Logs List */}
      <div className="space-y-4 overflow-auto pr-3 pb-5">
        {logs.map((log) => (
          <div
            key={log.id}
            className="rounded-lg border border-my-accent-three bg-my-bg p-4 shadow-md"
          >
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-lg font-bold text-my-headline">Task #{log.taskId}</h2>
              <p
                className={`rounded-full px-2 py-1 text-xs font-medium text-my-bg ${
                  log.logType === "CREATE"
                    ? "bg-my-accent-green"
                    : log.logType === "UPDATE"
                      ? "bg-my-accent-blue"
                      : "bg-my-accent-two"
                }`}
              >
                {log.logType}
              </p>
            </div>

            <p className="mb-2 text-my-paragraph">
              <span className="me-2 font-semibold">Changed By:</span>
              {getUsernameById(log.changedBy)}
            </p>

            <div className="mb-2 flex flex-wrap gap-4">
              <div className="rounded-md border border-my-accent-three p-3">
                <span className="font-semibold text-my-accent-blue">Old Task</span>
                {log.oldStatus ? (
                  <div className="space-y-1 rounded-md bg-my-bg">
                    <p>
                      <strong>Title:</strong> {log.oldStatus.title || "-"}
                    </p>
                    <p>
                      <strong>Description:</strong> {log.oldStatus.description || "-"}
                    </p>
                    <p>
                      <strong>Status:</strong> {log.oldStatus.status?.replace("_", " ") || "-"}
                    </p>
                    <p>
                      <strong className="me-1">Assigned To:</strong>
                      {log.oldStatus.assignedTo
                        ? getUsernameById(log.oldStatus.assignedTo)
                        : "Unassigned"}
                    </p>
                  </div>
                ) : (
                  <p className="mt-1">N/A</p>
                )}
              </div>

              <ChevronRightIcon className="my-auto" />

              <div className="rounded-md border border-my-accent-three p-3">
                <span className="font-semibold text-my-accent-green">New Task</span>
                {log.newStatus ? (
                  <div className="space-y-1 rounded-md bg-my-bg">
                    <p>
                      <strong>Title:</strong> {log.newStatus.title || "-"}
                    </p>
                    <p>
                      <strong>Description:</strong> {log.newStatus.description || "-"}
                    </p>
                    <p>
                      <strong>Status:</strong> {log.newStatus.status?.replace("_", " ") || "-"}
                    </p>
                    <p>
                      <strong className="me-1">Assigned To:</strong>
                      {log.newStatus.assignedTo
                        ? getUsernameById(log.newStatus.assignedTo)
                        : "Unassigned"}
                    </p>
                  </div>
                ) : (
                  <p className="mt-1">N/A</p>
                )}
              </div>
            </div>

            <p className="mb-2 text-sm text-my-paragraph">
              <span className="font-semibold">Notes:</span> {log.notes || "N/A"}
            </p>

            <p className="text-xs text-my-paragraph">
              <span className="font-semibold">Changed At:</span>{" "}
              {new Date(log.changedAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
