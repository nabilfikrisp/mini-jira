import { getUser } from "@/lib/data-access-layer";

export default async function Profile() {
  const user = await getUser();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="text-my-headline">
      <h1>Hi, {user.username}</h1>
      <h1>Role, {user.role}</h1>
    </div>
  );
}
