"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { MenuIcon, TvMinimalPlayIcon } from "lucide-react";
import { useApp } from "@/Provider/AppProvider";
import { Button } from "./ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./ui/navigation-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

/* ---------- STEP 1: menu data (edit links here) ---------- */
const navMenus = [
  {
    name: "Movies",
    links: [
      { label: "Popular", href: "/movie/popular" },
      { label: "Trending", href: "/movie/trending" },
      { label: "Upcoming", href: "/movie/upcoming" },
      { label: "Top Rated", href: "/movie/top-rated" },
    ],
  },
  {
    name: "TV Shows",
    links: [
      { label: "Popular", href: "/tv/popular" },
      { label: "Trending", href: "/tv/trending" },
      { label: "Top Rated", href: "/tv/top-rated" },
      { label: "On TV", href: "/tv/on-the-air" },
    ],
  },
  {
    name: "Genres",
    links: [
      { label: "Action", href: "/genre/28" },
      { label: "Animation", href: "/genre/16" },
      { label: "Comedy", href: "/genre/35" },
      { label: "Drama", href: "/genre/18" },
      { label: "Horror", href: "/genre/27" },
      { label: "Romance", href: "/genre/10749" },
      { label: "Sci-Fi", href: "/genre/878" },
      { label: "Thriller", href: "/genre/53" },
    ],
  },
  {
    name: "People",
    links: [{ label: "Popular People", href: "/person/popular" }],
  },
];

export default function Header() {
  const router = useRouter();
  const { auth, setAuth } = useApp();

  /* ---------- STEP 2: logout ---------- */
  const handleLogOut = () => {
    if (window.confirm("Do you really want to logout ? 🥲")) {
      setAuth(null);
      localStorage.removeItem("token");
      router.refresh();
    }
  };

  return (
    <header className="w-full border-b border-b-[#01b4e4]/20 bg-[#032541]">
      <div className="flex h-18 items-center justify-between px-6 text-white">
        {/* ---------- STEP 3: logo ---------- */}
        <Link
          href="/"
          className="flex items-center gap-2 text-3xl font-bold transition hover:text-[#01b4e4]"
        >
          <TvMinimalPlayIcon size={26} className="text-[#01b4e4]" />
          Movie HUB
        </Link>

        {/* ---------- STEP 4: desktop navigation menu ---------- */}
        <NavigationMenu className="hidden lg:flex" viewport={false} delayDuration={100}>
          <NavigationMenuList className="gap-4">
            {/* Home */}
            <NavigationMenuItem>
              <Link href="/" className="px-2 py-1 text-lg transition hover:text-[#01b4e4]">
                Home
              </Link>
            </NavigationMenuItem>

            {/* Profile (only when logged in) */}
            {auth && (
              <NavigationMenuItem>
                <Link href="/profile" className="px-2 py-1 text-lg transition hover:text-[#01b4e4]">
                  Profile
                </Link>
              </NavigationMenuItem>
            )}

            {/* Movies, TV Shows, Genres, People dropdowns */}
            {navMenus.map((menu) => (
              <NavigationMenuItem key={menu.name} className="relative">
                <NavigationMenuTrigger className="bg-transparent px-2 text-lg font-normal text-white hover:bg-transparent hover:text-[#01b4e4] focus:bg-transparent focus:text-[#01b4e4] data-[state=open]:bg-transparent data-[state=open]:text-[#01b4e4]">
                  {menu.name}
                </NavigationMenuTrigger>

                <NavigationMenuContent className="bg-white text-black">
                  <ul className="w-44 p-1">
                    {menu.links.map((link) => (
                      <li key={link.href}>
                        <NavigationMenuLink asChild>
                          <Link
                            href={link.href}
                            className="block rounded-md px-3 py-2 text-base hover:bg-gray-100 hover:text-[#01b4e4]"
                          >
                            {link.label}
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* ---------- STEP 5: right side (login / logout + mobile menu) ---------- */}
        <div className="flex items-center gap-3">
          {/* desktop buttons */}
          <div className="hidden items-center gap-3 lg:flex">
            {!auth ? (
              <>
                <Link href="/login">
                  <Button variant="link" className="text-white hover:text-[#01b4e4]">
                    Log in
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-[#01b4e4] text-white hover:bg-[#01b4e4]/80">
                    Sign up
                  </Button>
                </Link>
              </>
            ) : (
              <Button onClick={handleLogOut} variant="destructive">
                Log out
              </Button>
            )}
          </div>

          {/* mobile menu */}
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button size="icon" variant="default">
                <MenuIcon className="size-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="left" className="border-[#01b4e4]/20 bg-[#032541] text-white">
              <SheetHeader className="border-b border-b-[#01b4e4]/20">
                <SheetTitle className="flex items-center gap-2 text-xl text-white">
                  <TvMinimalPlayIcon size={28} className="text-[#01b4e4]" />
                  Movie HUB
                </SheetTitle>
              </SheetHeader>

              <nav className="mt-6 flex flex-col gap-2 px-4 text-lg">
                <SheetClose asChild>
                  <Link href="/" className="px-2 py-1 hover:text-[#01b4e4]">Home</Link>
                </SheetClose>

                {auth && (
                  <SheetClose asChild>
                    <Link href="/profile" className="px-2 py-1 hover:text-[#01b4e4]">Profile</Link>
                  </SheetClose>
                )}

                {navMenus.map((menu) => (
                  <SheetClose asChild key={menu.name}>
                    <Link href={menu.links[0].href} className="px-2 py-1 hover:text-[#01b4e4]">
                      {menu.name}
                    </Link>
                  </SheetClose>
                ))}
              </nav>

              <div className="mt-4 flex flex-col gap-3 px-5">
                {!auth ? (
                  <>
                    <SheetClose asChild>
                      <Link href="/login">
                        <Button className="w-full bg-[#01b4e4]/20 text-white">Log in</Button>
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link href="/register">
                        <Button className="w-full bg-[#01b4e4] text-white">Sign up</Button>
                      </Link>
                    </SheetClose>
                  </>
                ) : (
                  <Button onClick={handleLogOut} variant="destructive" className="w-full">
                    Log out
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}