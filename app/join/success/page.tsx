import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center text-white px-6">
      <h1 className="text-2xl tracking-[3px] mb-4">
        Welcome to the Sanctuary
      </h1>

      <p className="text-white/70 mb-8 max-w-sm">
        Your membership is active. Create your account to continue.
      </p>

    <Link
  href="/auth/signup"
  className="btn-golden w-full py-3 text-[12px] tracking-[2px] text-center block"
>
  CREATE ACCOUNT
</Link>

    </div>
  );
}
