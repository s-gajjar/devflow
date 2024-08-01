import {
    Select,
    SelectContent, SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"


interface FiltersProps {
    filters: {
        name: string;
        value: string;
    }[];
    otherClasses?: string;
    containerClasses?: string;
}

const Filters = ({
                     filters,
                     otherClasses,
                     containerClasses,
                 }: FiltersProps) => {
    return (
        <div className={`relative ${containerClasses}`}>
            <Select>
                <SelectTrigger
                    className={`${otherClasses} body-regular light-border background-light800_dark300 dark:text-white-900 border px-4 py-2 rounded-md`}>
                    <div className="line-clamp-1 flex-1 text-left">
                        <SelectValue placeholder="Select a filter" className="body-regular text-light700_light500 mx-2"/>
                    </div>
                </SelectTrigger>

                <SelectContent>
                   <SelectGroup className="dark:text-light-900">
                       {filters.map((item) => (
                           <SelectItem key={item.value} value={item.value}>
                               {item.name}
                           </SelectItem>
                       ))}
                   </SelectGroup>
                </SelectContent>
            </Select>

        </div>
    )
}

export default Filters