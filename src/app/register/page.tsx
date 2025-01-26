import RegisterForm from "./form";

export default async function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm rounded-lg border-2 border-my-headline p-8 shadow-sm">
        <h1 className="mb-6 text-center text-2xl font-semibold text-my-headline">
          Create an Account
        </h1>
        <p className="mb-8 text-center text-my-paragraph">Register to get started</p>
        <RegisterForm />
        <div className="mt-6 text-center">
          <p className="text-sm text-my-paragraph">
            Already have an account?{" "}
            <a href="/login" className="text-my-accent-one hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
