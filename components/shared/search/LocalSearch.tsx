"use client";

import Image from "next/image";
import {Input} from "@/components/ui/input";

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
    return (
        <div
            className={`background-light800_darkgradient flex min-h-[56px] grow items-center gap-4 rounded-[10px] px-4 ${otherClasses}`}>
            {iconPosition === "left" && (
                <Image src={imgSrc} width={20} height={20} alt="Search Icon" className="cursor-pointer"/>)}

            <Input
                className="h-full w-full bg-transparent text-light-500 dark:text-dark-100 border-none outline-none no-focus"
                type="text"
                placeholder={placeholder}
                value=""
                onChange={() => {
                }}
            />

            {iconPosition === "right" && (
                <Image src={imgSrc} width={20} height={20} alt="Search Icon" className="cursor-pointer"/>)}


        </div>
    )
}

export default LocalSearch