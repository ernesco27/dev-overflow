import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import NavLinks from "./navbar/NavLinks";
import { auth, signOut } from "../../../auth";
import ROUTES from "../../../constants/route";

const LeftSidebar = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  return (
    <section className="flex h-screen w-fit  lg:w-[266px] flex-col justify-between background-light900_dark200 border-r light-border sticky left-0 top-0 p-6 pt-36 overflow-y-auto shadow-light-300 dark:shadow-none max-sm:hidden custom-scrollbar ">
      <div className="flex flex-1 flex-col gap-6">
        <NavLinks userId={userId!} />
      </div>

      <div className="flex flex-col gap-3">
        {!userId ? (
          <>
            <Button className="small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none cursor-pointer">
              <Link href={ROUTES.SIGN_IN}>
                <Image
                  src="/icons/account.svg"
                  alt="Account"
                  width={20}
                  height={20}
                  className="invert-colors lg:hidden"
                />
                <span className="primary-text-gradient max-lg:hidden">
                  Log In
                </span>
              </Link>
            </Button>
            <Button className="small-medium light-border-2 btn-tertiary text-dark400_light900 min-h-[41px] w-full rounded-lg border px-4 py-3 shadow-none cursor-pointer">
              <Link href={ROUTES.SIGN_UP}>
                <Image
                  src="/icons/sign-up.svg"
                  alt="Account"
                  width={20}
                  height={20}
                  className="invert-colors lg:hidden"
                />
                <span className="max-lg:hidden">Sign Up</span>
              </Link>
            </Button>
          </>
        ) : (
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <Button
              type="submit"
              className="base-medium w-fit !bg-transparent px-4 py-3 cursor-pointer"
            >
              <Image
                src="/icons/logout-3.svg"
                alt="Logout"
                width={20}
                height={20}
                className="invert-colors"
              />
              <span className="max-lg:hidden text-dark300_light900">
                Log Out
              </span>
            </Button>
          </form>
        )}
      </div>
    </section>
  );
};

export default LeftSidebar;
