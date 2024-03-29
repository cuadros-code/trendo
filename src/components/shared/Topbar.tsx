import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useSignOurAccountMutation } from "@/lib/react-query/queriesAndMutations";
import { useEffect } from "react";
import { useUserContext } from "@/context/AuthContext";

const Topbar = () => {

  const navigate = useNavigate()
  const { mutate: signOut, isSuccess, isPending } =  useSignOurAccountMutation()
  const { user } = useUserContext()

  useEffect(() => {
    if(isSuccess) {
      navigate(0)
    }
  }, [isSuccess])

  return ( 
    <section className="topbar">
      <div className="flex-between py-4 px-5">
        <Link to="/" className="flex gap-3 items-center">
          <img 
            src="/assets/images/logo.svg" 
            alt="logo app" 
            width={130}
            height={325}
          />
        </Link>

        <div className="flex gap-4">
          <Button 
            disabled={isPending}
            variant="ghost" 
            className="shad-button_ghost" 
            onClick={() => signOut()}
          >
            <img src="/assets/icons/logout.svg" alt="logout" />
          </Button>
          <Link to={`/profile/${user.id}`} className="flex-center gap-3">
            <img 
              src={user.imageUrl || '/assets/icons/profile-placeholder.svg'}
              alt="avatar" 
              width={40}
              height={40}
              className="rounded-full"
            />
          </Link>
        </div>

      </div>
    </section>
  );
}
 
export default Topbar;