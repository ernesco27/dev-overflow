import { Button } from "@/components/ui/button";
import { auth, signOut } from "../../../auth";
import ROUTES from "../../../constants/route";

const Home = async () => {
  const session = await auth();

  console.log("Session:", session);

  return (
    <>
      <form
        className="px-10 pt-[100px]"
        action={async () => {
          "use server";
          await signOut({ redirectTo: ROUTES.SIGN_IN });
        }}
      >
        <Button type="submit">Log Out</Button>
      </form>
    </>
  );
};

export default Home;
