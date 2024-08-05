"use client";

import Image from "next/image";
import {Input} from "@/components/ui/input";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";
import {formUrlQuery, removeKeyFromQuery} from "@/lib/utils";

interface LocalSearchProps {
    route: string;
    iconPosition: "left" | "right";
    imgSrc: string;
    placeholder: string;
    otherClasses?: string;
}


const LocalSearch = ({
                         route,
                         iconPosition,
                         imgSrc,
                         placeholder,
                         otherClasses
                     }: LocalSearchProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const query = searchParams.get("q");

    const [search, setSearch] = useState(query || '');

    useEffect(() => {
        const delaydebouncedFn = setTimeout(()=>{
            if(search){
                const newUrl = formUrlQuery({
                    params: searchParams.toString(),
                    key: 'q',
                    value: search
                })

                router.push(newUrl);
            }else{
                if(pathname === route){
                    const newUrl = removeKeyFromQuery({
                        params: searchParams.toString(),
                        keysToRemove: ['q'],
                    })
                    router.push(newUrl, {scroll: false});
                }
            }
        }, 300)
    }, [search, route, pathname, router, searchParams, query]);

    return (
        <div
            className={`background-light800_darkgradient flex min-h-[56px] grow items-center gap-4 rounded-[10px] px-4 ${otherClasses}`}>
            {iconPosition === "left" && (
                <Image src={imgSrc} width={20} height={20} alt="Search Icon" className="cursor-pointer"/>)}

            <Input
                className="h-full w-full bg-transparent text-light-500 dark:text-dark-100 border-none outline-none no-focus"
                type="text"
                placeholder={placeholder}
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value);
                }}
            />

            {iconPosition === "right" && (
                <Image src={imgSrc} width={20} height={20} alt="Search Icon" className="cursor-pointer"/>)}

        </div>
    )
}

export default LocalSearch