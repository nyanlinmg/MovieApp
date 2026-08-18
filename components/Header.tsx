"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { MenuIcon, TvMinimalPlayIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader, SheetFooter, SheetClose } from "./ui/sheet";
import { useApp } from "@/Provider/AppProvider";
import { motion, type Variants } from "framer-motion";

const navContainerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.1,
    },
  },
};

const navItemVariants: Variants = {
  hidden: { opacity: 0, x: -16 },
  show: { opacity: 1, x: 0, transition: { duration: 0.25, ease: "easeOut" } },
};

const desktopNavContainerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
};

const desktopNavItemVariants: Variants = {
  hidden: { opacity: 0, y: -10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const {auth, setAuth} = useApp();

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/") {
      e.preventDefault();
      router.refresh();
    }
  };

  const handleLogOut = () => {
      if(window.confirm("Do you really want to logout ? 🥲")){
        setAuth(null);
        localStorage.removeItem('token');
        router.refresh();
        window.alert("finished.....");
      }
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="border-b w-full bg-[#032541] border-b-[#01b4e4]/20"
    >
      <div className="w-full flex h-18 text-white items-center justify-between px-6">
        <Link
          href="/"
          onClick={handleLogoClick}
          className="text-3xl hover:text-[#01b4e4] transition flex items-center gap-2 font-bold text-white"
        >
            <motion.span
              whileHover={{ rotate: -12, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
              className="inline-flex"
            >
              <TvMinimalPlayIcon size={26} className="text-[#01b4e4]" />
            </motion.span>
            Movie HUB
        </Link>

        <NavigationMenu className="hidden lg:flex">
            <motion.div variants={desktopNavContainerVariants} initial="hidden" animate="show">
                <NavigationMenuList className="gap-8">
                    <motion.div variants={desktopNavItemVariants}>
                        <NavigationMenuItem className="text-lg relative group/home">
                        <Link href="/" onClick={handleLogoClick} className="relative inline-block py-1 transition group-hover/home:text-[#01b4e4]">
                            Home
                            <span className="absolute left-0 -bottom-0.5 h-0.5 w-0 bg-[#01b4e4] transition-all duration-300 group-hover/home:w-full" />
                        </Link>
                        </NavigationMenuItem>
                    </motion.div>

                    {auth &&
                        <motion.div variants={desktopNavItemVariants}>
                        <NavigationMenuItem className="text-lg relative group/profile">
                            <Link href="/" className="relative inline-block py-1 transition group-hover/profile:text-[#01b4e4]">
                            Profile
                            <span className="absolute left-0 -bottom-0.5 h-0.5 w-0 bg-[#01b4e4] transition-all duration-300 group-hover/profile:w-full" />
                            </Link>
                        </NavigationMenuItem>
                        </motion.div>
                    }

                    <motion.div variants={desktopNavItemVariants}>
                        <NavigationMenuItem className="text-lg relative group/browse">
                        <Link href="/" className="relative inline-block py-1 transition group-hover/browse:text-[#01b4e4]">
                            Movies
                            <span className="absolute left-0 -bottom-0.5 h-0.5 w-0 bg-[#01b4e4] transition-all duration-300 group-hover/browse:w-full" />
                        </Link>
                        </NavigationMenuItem>
                    </motion.div>

                    <motion.div variants={desktopNavItemVariants}>
                        <NavigationMenuItem className="text-lg relative group/genres">
                        <Link href="/" className="relative inline-block py-1 transition group-hover/genres:text-[#01b4e4]">
                            TV Shows
                            <span className="absolute left-0 -bottom-0.5 h-0.5 w-0 bg-[#01b4e4] transition-all duration-300 group-hover/genres:w-full" />
                        </Link>
                        </NavigationMenuItem>
                    </motion.div>

                    <motion.div variants={desktopNavItemVariants}>
                        <NavigationMenuItem className="text-lg relative group/genres">
                        <Link href="/" className="relative inline-block py-1 transition group-hover/genres:text-[#01b4e4]">
                            Genres
                            <span className="absolute left-0 -bottom-0.5 h-0.5 w-0 bg-[#01b4e4] transition-all duration-300 group-hover/genres:w-full" />
                        </Link>
                        </NavigationMenuItem>
                    </motion.div>

                    <motion.div variants={desktopNavItemVariants}>
                        <NavigationMenuItem className="text-lg relative group/characters">
                        <Link href="/" className="relative inline-block py-1 transition group-hover/characters:text-[#01b4e4]">
                            People
                            <span className="absolute left-0 -bottom-0.5 h-0.5 w-0 bg-[#01b4e4] transition-all duration-300 group-hover/characters:w-full" />
                        </Link>
                        </NavigationMenuItem>
                    </motion.div>
                </NavigationMenuList>
            </motion.div>
        </NavigationMenu>

        <div className="flex items-center">
            {!auth && 
                <motion.div
                  className="hidden lg:flex"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4, ease: "easeOut" }}
                >
                    <Link href="/login">
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                          <Button variant="link" size="lg" className="px-5 cursor-pointer text-md text-white hover:text-[#01b4e4] py-2 me-3 transition">
                              Log in
                          </Button>
                        </motion.div>
                    </Link>

                    <Link href="/register">
                        <motion.div
                          whileHover={{ scale: 1.1, boxShadow: "0 0 16px rgba(1,180,228,0.6)" }}
                          whileTap={{ scale: 0.95 }}
                          className="rounded-md me-3"
                        >
                          <Button variant="default" size="lg" className="px-5 cursor-pointer text-md bg-[#01b4e4] text-white hover:bg-[#01b4e4]/80 py-2 transition">
                          Sign up
                          </Button>
                        </motion.div>
                    </Link>
                </motion.div>
            }

            {auth && 
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="me-2 hidden lg:block">
                <Button onClick={handleLogOut} className="cursor-pointer" variant="destructive">
                    Log out
                </Button>
              </motion.div>
            }

            <Sheet>
              <SheetTrigger asChild className="lg:hidden">
                <motion.div whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.05 }}>
                  <Button
                    variant="default"
                    size="icon-lg"
                    className="px-6 cursor-pointer hover:text-[#01b4e4]"
                  >
                    <MenuIcon className="size-5" />
                  </Button>
                </motion.div>
              </SheetTrigger>

              <SheetContent side="left" className="bg-[#032541] text-white border-[#01b4e4]/20">
                <SheetHeader className="border-b border-b-[#01b4e4]/20">
                  <SheetTitle className="text-white flex text-xl items-center gap-2">
                    <TvMinimalPlayIcon size={28} className="text-[#01b4e4]" />
                    Anime HUB
                  </SheetTitle>
                </SheetHeader>

                <motion.nav
                  variants={navContainerVariants}
                  initial="hidden"
                  animate="show"
                  className="flex flex-col gap-4 mt-6 px-4 text-lg"
                >
                    <motion.div variants={navItemVariants}>
                      <SheetClose asChild>
                        <Link href="/" className="block hover:text-[#01b4e4] transition px-2 py-1">
                          Home
                        </Link>
                      </SheetClose>
                    </motion.div>

                    {auth && 
                      <motion.div variants={navItemVariants}>
                        <SheetClose asChild>
                          <Link href="/profile" className="block hover:text-[#01b4e4] transition px-2 py-1">
                            Profile
                          </Link>
                        </SheetClose>
                      </motion.div>
                    }

                    <motion.div variants={navItemVariants}>
                      <SheetClose asChild>
                        <Link href="/browse" className="block hover:text-[#01b4e4] transition px-2 py-1">
                          Browse
                        </Link>
                      </SheetClose>
                    </motion.div>

                    <motion.div variants={navItemVariants}>
                      <SheetClose asChild>
                        <Link href="/genres" className="block hover:text-[#01b4e4] transition px-2 py-1">
                          Genres
                        </Link>
                      </SheetClose>
                    </motion.div>

                    <motion.div variants={navItemVariants}>
                      <SheetClose asChild>
                        <Link href="/characters" className="block hover:text-[#01b4e4] transition px-2 py-1">
                          Characters
                        </Link>
                      </SheetClose>
                    </motion.div>
                  </motion.nav>

                  {!auth ? 
                    <motion.div
                      variants={navContainerVariants}
                      initial="hidden"
                      animate="show"
                      className="flex flex-col gap-3 px-5 mt-3 border-b border-b-[#01b4e4]/20 pb-6"
                    >
                        <motion.div variants={navItemVariants}>
                          <SheetClose asChild >
                              <Link href="/login">
                                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                                    <Button variant="default" className="px-5 w-full cursor-pointer bg-[#01b4e4]/20 text-white hover:text-[#01b4e4] py-5 ">
                                        <p className="text-xl">Log in</p>
                                    </Button>
                                  </motion.div>
                              </Link>
                          </SheetClose>
                        </motion.div>

                        <motion.div variants={navItemVariants}>
                          <SheetClose asChild>
                              <Link href="/register">
                                  <motion.div
                                    whileHover={{ scale: 1.03, boxShadow: "0 0 16px rgba(1,180,228,0.6)" }}
                                    whileTap={{ scale: 0.97 }}
                                    className="rounded-md"
                                  >
                                    <Button variant="default" className="px-5 w-full bg-[#01b4e4] text-white hover:bg-[#01b4e4]/80 py-6 cursor-pointer">
                                        <p className="text-xl">Sign up</p>
                                    </Button>
                                  </motion.div>
                              </Link>
                          </SheetClose>
                        </motion.div>
                    </motion.div> : 
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} className="mx-5">
                      <Button onClick={handleLogOut} className="cursor-pointer w-full py-5 border-2 font-bold text-lg border-red-900" variant="destructive">
                          Log out
                      </Button>
                    </motion.div>
                  }
                  
              </SheetContent>
            </Sheet>
        </div>
      </div>
    </motion.header>
  );
}