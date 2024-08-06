"use client"

import {useEffect, useState} from "react";
import {ReloadIcon} from "@radix-ui/react-icons";
import {useRouter, useSearchParams} from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import GlobalFilter from "@/components/shared/search/GlobalFilter";

const GlobalResult = () => {
    const router = useRouter();

    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState([
        {
            type: 'question',
            id: '1',
            title: 'Javascript',
        },
        {
            type: 'tag',
            id: '1',
            title: 'Typescript',
        },
        {
            type: 'user',
            id: '2',
            title: 'Python',
        }
    ]);

    const global = searchParams.get('global');
    const type = searchParams.get('type');

    useEffect(() => {
        const fetchResult = async () => {
            setResult([]);
            setIsLoading(true);

            try {

            } catch (e) {
                console.log(e);
                throw e;
            } finally {
                setIsLoading(false);
            }
        }
    }, [global, type])

    const renderLink = (type: string, id: string) => {
        return `/${type}/${id}`
    }


    return (
        <div className="absolute top-full z-10 mt-3 w-full bg-light-800 py-5 shadow-sm dark:bg-dark-400 rounded-xl">
            <GlobalFilter/>
            <div className="my-5 h-[1px] bg-light-700/50 dark:bg-dark-500/50"/>
            <div className="space-y-5">
                <p className="text-dark400_light900 paragraph-semibold px-5">
                    Top Match
                </p>
                {isLoading ? (
                    <div className="flex-center flex-col px-5 justify-center">
                        <ReloadIcon className="animate-spin h-8 w-8 text-primary-500"/>
                        <p className="text-dark200_light800 body-regular mt-3">
                            Browsing for the best matches
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        {result.length > 0 ? (
                            result.map((item: any, index: number) => (
                                <Link key={item.type + item.id + index}
                                      href={renderLink('type', item._id)}
                                      className="flex w-full cursor-pointer items-start px-5 py-2.5 gap-3 hover:bg-light-700/50 dark:bg-dark-500/50">
                                    <Image src="/assets/icons/tag.svg" width={18} height={18} alt="tag" className="invert-colors mt-1 object-contain"/>
                                    <div className="flex flex-col">
                                        <p className="body-medium text-dark200_light800 line-clamp-1">{item.title}</p>
                                        <p className="text-light400_light500 small-medium mt-1 font-bold capitalize">{item.type}</p>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="flex-center flex-col px-5 justify-center">
                                <p className="text-dark400_light900 body-regular px-5 py-2.5">
                                    Oops! No results found
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default GlobalResult