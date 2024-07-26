import { Input } from "@/components/ui/input";
import Image from "next/image";

const GlobalSearch = () => {
    return (
        <div className="relative w-full max-w-[600px] max-lg:hidden">
            <div className="background-light800_darkgradient relative flex min-h-[56px] grow items-center gap-1 rounded-xl px-4">
                <Image src="/assets/icons/search.svg" className="cursor-pointer" width={20} height={20} alt="Search Icon"/>
                <Input type="text" placeholder="Search anything globally..." className="h-full w-full bg-transparent text-light-500 dark:text-dark-100 border-none outline-none no-focus"/>
            </div>
        </div>
    )
}
export default GlobalSearch