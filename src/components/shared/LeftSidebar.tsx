import { sidebarLinks } from "@/constants";
import { useUserContext } from "@/context/AuthContext";
import { useSignOurAccountMutation } from "@/lib/react-query/queriesAndMutations";
import { useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

const LeftSidebar = () => {

  const navigate = useNavigate()
  const { mutate: signOut, isSuccess, isPending } =  useSignOurAccountMutation()
  const { user } = useUserContext()  

  useEffect(() => {
    if(isSuccess) {
      navigate(0)
    }
  }, [isSuccess])

  return (
    <nav className="leftsidebar">
      <div className="flex flex-col gap-11">
        <Link to="/" className="flex gap-3 items-center">
          <img 
            src="/assets/images/logo.svg" 
            alt="logo app" 
            width={170}
            height={36}
          />
        </Link>

        <Link to={`/profile/${user.id}`} className="flex gap-3 items-center">
          <img 
            src={user.imageUrl || '/assets/icons/profile-placeholder.svg'}
            alt="profile" 
            className="rounded-full"
            width={35}
            height={35}
          />
          <div className="flex flex-col">
            <p className="font-bold">{user.name}</p>
            <p className="text-xs text-gray-400">@{user.username}</p>
          </div>
        </Link>

        <ul className="flex flex-col gap-6">
          {
            sidebarLinks.map((link, index) => (
              <li className="leftsidebar-link" key={index}>
                <NavLink
                  to={link.route}
                  className="flex gap-4 items-center p-4"
                >
                  <img 
                    src={link.imgURL} 
                    alt={link.label}
                    className="group-hover:filter-white"
                  />
                  {link.label}
                </NavLink>
              </li>
            ))
          }
        </ul>

      </div>
    </nav>
  );
}
 
export default LeftSidebar;