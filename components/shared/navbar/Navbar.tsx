import Link from "next/link";
import Image from "next/image";
import React from "react";
import {SignedIn, UserButton} from "@clerk/nextjs";
import ThemeSwitcher from "./Theme";
import MobileNav from "@/components/shared/navbar/MobileNav";
import GlobalSearch from "@/components/shared/search/GlobalSearch";

const Navbar = () => {
    return (
        <nav className="flex-between background-light900_dark200 fixed z-50 w-full gap-5 p-6 shadow-light-300 dark:shadow-none sm:px-12">
            <Link href="/" className="flex items-center gap-2">
                <Image src="/assets/images/site-logo.svg" width={24} height={24} alt="DevFlow Logo"/>
                <p className="h2-bold font-spaceGrotesk text-dark-100 dark:text-light-900 max-sm:hidden">Dev<span className="text-primary-500">OverFlow</span></p>
            </Link>
            <GlobalSearch/>

            <div className="flex-between gap-5">
                <ThemeSwitcher/>

                <SignedIn>
                    <UserButton
                        appearance={{
                            elements: {
                                avatarBox: 'h-10 w-10',
                            },
                            variables: {
                                colorPrimary: '#ff7000',
                            }
                        }}/>
                </SignedIn>

                <MobileNav/>
            </div>
        </nav>
    )
}

export default Navbar