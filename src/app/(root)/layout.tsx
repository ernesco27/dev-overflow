import { ReactNode, Suspense } from "react";
import Navbar from "@/components/navigation/navbar";
import LeftSidebar from "@/components/navigation/LeftSidebar";
import RightSidebar from "@/components/navigation/RightSidebar";

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="background-light850_dark100 relative">
      <Navbar />

      <div className="flex">
        <Suspense fallback={<div className="mt-10">Loading jobs...</div>}>
          <LeftSidebar />
        </Suspense>
        <section className="flex min-h-screen flex-1 flex-col px-6 py-36 max-md:pb-14 sm:px-14 ">
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </section>
        <Suspense fallback={<div className="mt-10">Loading jobs...</div>}>
          <RightSidebar />
        </Suspense>
      </div>
    </main>
  );
};

export default RootLayout;
