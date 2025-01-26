import Sidebar from "@/components/sidebar";
import { getUser } from "@/lib/data-access-layer";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex w-screen h-screen">
      <Sidebar username={user.username} />
      <main className="ml-4 flex-1 min-w-0 lg:ml-0">{children}</main>
    </div>
  );
}
