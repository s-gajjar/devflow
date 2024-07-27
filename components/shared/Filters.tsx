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
                    className={`${otherClasses} body-regular light-border background-light800_dark300 text-light700_light500 border px-4 py-2`}>
                    <div className="line-clamp-1 flex-1 text-left">
                        <SelectValue placeholder="Select a filter"/>
                    </div>
                </SelectTrigger>

                <SelectContent>
                   <SelectGroup>
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