import { ReactNode } from 'react';

export const revalidate = 0;

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-[440px]">{children}</div>
    </div>
  );
}
