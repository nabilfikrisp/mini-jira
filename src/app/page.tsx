import LogoutButton from "./components/logout-button";
import Profile from "./components/profile";

export default async function HomePage() {
  return (
    <div>
      <Profile />
      <LogoutButton />
    </div>
  );
}
