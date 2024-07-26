import Image from "next/image";
import {Button} from "@/components/ui/button";
import React from "react";
import Link from "next/link";

interface NoResultProps {
    title?: string;
    description?: string;
    link: string;
    linkTitle?: string;
}

const NoResult = ({
    title,
    description,
    link,
    linkTitle,
                  }: NoResultProps) => {
    return (
        <div className="mt-10 flex w-full flex-col items-center justify-center">
            <Image className="block object-contain dark:hidden" src={"/assets/images/light-illustration.png"}
                   width={270} height={270} alt="No Result Illustration"/>
            <Image className="dark:flex object-contain hidden" src={"/assets/images/dark-illustration.png"} width={270}
                   height={270} alt="No Result Illustration"/>

            <h2 className="h2-bold text-dark200_light900 mt-8">{title}</h2>
            <p className="body-regular text-dark500_light700 my-3.5 max-w-md text-center">{description}</p>

            <Link href={link} className="flex items-center gap-2">
                <Button className="primary-gradient min-h-[46px] !text-light-900 px-4 py-3">{linkTitle}</Button>
            </Link>
        </div>
    )
}

export default NoResult