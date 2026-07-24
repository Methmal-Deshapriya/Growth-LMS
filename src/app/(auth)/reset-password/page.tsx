import React, { Suspense } from "react";
import ResetPasswordForm from "@/features/auth/components/ResetPasswordForm";
import Image from "next/image";
import Link from "next/link";

const ResetPasswordPage = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50 p-4">
      <Link href="/" className="mb-8 hover:opacity-80 transition-opacity">
        <Image src="/assets/logo.png" alt="Foundry Academy" width={150} height={150} />
      </Link>
      <Suspense fallback={null}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
};

export default ResetPasswordPage;
