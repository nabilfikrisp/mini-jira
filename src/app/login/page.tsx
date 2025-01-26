import LoginForm from "./form";

export default async function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm rounded-lg border-2 border-my-headline p-8 shadow-sm">
        <h1 className="mb-6 text-center text-2xl font-semibold text-my-headline">Welcome Back</h1>
        <p className="mb-8 text-center text-my-paragraph">Login to your account</p>
        <LoginForm />
        <div className="mt-6 text-center">
          <p className="text-sm text-my-paragraph">
            Don&apos;t have an account?{" "}
            <a href="/register" className="text-my-accent-one hover:underline">
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
