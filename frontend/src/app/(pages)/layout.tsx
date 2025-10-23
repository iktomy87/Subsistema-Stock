import Sidebar from "@/components/shared/sidebar";
import Navbar from "@/components/shared/navbar";
import { NextAuthProvider } from "./providers";

export default function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NextAuthProvider>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />
          <main className="p-4">{children}</main>
        </div>
      </div>
    </NextAuthProvider>
  );
}
