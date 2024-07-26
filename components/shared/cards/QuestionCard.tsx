"use client";
interface Answer {
    id: string;
    content: string;
    // Add other properties as needed
}

interface QuestionCardProps {
    // ... other properties
    answers?: Answer[];
    // ... rest of the properties
}
interface QuestionCardProps {
    _id: string;
    title: string;
    tags: {
        _id: number;
        name: string
    }[];
    author: {
        _id: string;
        name: string;
        picture: string;
    };
    upvotes?: number;
    views?: number;
    answers?: Answer[];
    createdAt?: Date;
}




const QuestionCard = ({
    _id,
    title,
    tags,
    author,
    upvotes,
    views,
    answers,
    createdAt,
                      }: QuestionCardProps) => {
    return (
        <div className="card-wrapper rounded-[10px] p-9 sm:px-12">
            {title}
        </div>
    )
}

export default QuestionCard