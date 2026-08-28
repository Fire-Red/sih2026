import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-4 sm:py-8 lg:py-10 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto">
        {children}
      </div>
    </div>
  );
}
