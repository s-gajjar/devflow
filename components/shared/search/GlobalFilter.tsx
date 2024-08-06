"use client"

import {GlobalSearchFilters} from "@/constants/filters";
import {Button} from "@/components/ui/button";
import {useRouter, useSearchParams} from "next/navigation";
import {useState} from "react";
import {formUrlQuery} from "@/lib/utils";

const GlobalFilter = () => {

    const router = useRouter();
    const searchParams = useSearchParams();

    const typeParams = searchParams.get("type");

    const [activeType, setActiveType] = useState(typeParams || '');

    const handleTypeClick = (item: string) => {
        if(activeType === item) {
            setActiveType("");

            const newUrl = formUrlQuery({
                params: searchParams.toString(),
                key: 'type',
                value: null!,
            })

            router.push(newUrl, { scroll: false });
        } else {
            setActiveType(item);

            const newUrl = formUrlQuery({
                params: searchParams.toString(),
                key: 'type',
                value: item.toLowerCase()
            })
            router.push(newUrl, { scroll: false });
        }
    }

    return (
        <div className="flex px-5 gap-5 items-center">
            <p className="text-dark400_light900 body-medium">Type:</p>
            <div className="flex gap-3">
                {GlobalSearchFilters.map((item) => (
                    <Button
                        key={item.value}
                        type="button"
                        className={`light-border-2 rounded-3xl px-5 py-2 capitalize small-medium dark:text-light-800 dark:hover:text-primary-500
                        ${activeType === item.value ? 'bg-primary-500 text-light-900' : 'bg-light-700 text-dark-400 hover:text-primary-500 dark:bg-dark-500'}`}
                        onClick={() => {
                            handleTypeClick(item.value);
                        }}
                    >
                        {item.name}
                    </Button>
                ))}
            </div>
        </div>
    )
}

export default GlobalFilter