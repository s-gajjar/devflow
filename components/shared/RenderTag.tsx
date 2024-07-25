import Link from "next/link";
import { Badge } from "../ui/badge";

interface TagProps {
    _id: number;
    name: string;
    totalQuestions: number;
    showCount?: boolean;
}

const RenderTag = ({_id, name, totalQuestions, showCount = false}: TagProps) => {
    return (
        <Link href={`/tags/${_id}`} className="flex items-center gap-2">
            <Badge className="subtle-medium background-light800_dark300 text-light400_light500 rouned-md border-none px-4 py-2 uppercase">{name}</Badge>
        </Link>
    )
}

export default RenderTag