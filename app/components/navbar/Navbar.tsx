"use client";

import Container from "../Container";
import Categories from "./Categories";
import Logo from "./Logo";
import UserMenu from "./UserMenu";
import { SafeUser } from "@/app/types";

interface NavbarProps {
  currentUser?: SafeUser | null;
}


const Navbar: React.FC<NavbarProps> = ({
  currentUser
}) => {
  return (
    <div className="w-full fixed shadow-sm z-10 bg-white">
      <div className="py-4 border-b-[1px]">
        <Container>
          <div className="flex flex-row justify-between items-center gap-3 md:gap-0">
            <Logo />
            <UserMenu currentUser={currentUser} />
          </div>
        </Container>
      </div>
      <Categories />
    </div>
  )
}

export default Navbar
