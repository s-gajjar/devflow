import Link from "next/link";
import RenderTag from "../RenderTag";
import Metric from "../Metric";
import { formatLargeNumber, getTimeStamp } from "@/lib/utils";
import {SignedIn} from "@clerk/nextjs";
import EditDeleteButton from "@/components/shared/EditDeleteButton";

interface QuestionCardProps {
    _id: string;
    title: string;
    clerkId?: string;
    tags: Array<{ _id: string; name: string }>;
    author: { _id: string; name: string; picture: string };
    upvotes: number[];
    views: number;
    answers: Array<{ _id: string; content: string }>;
    createdAt: Date;
}

const QuestionCard = ({
                          _id,
                          title,
                          tags,
                          clerkId,
                          author,
                          upvotes,
                          views,
                          answers,
                          createdAt,
                      }: QuestionCardProps) => {
    const showActionButton =  clerkId;

    return (
        <div className="card-wrapper mt-10 rounded-[10px] p-3 sm:px-12">
            <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
                <div>
                    <Link href={`/questions/${_id}`} className="flex items-center gap-2">
                        <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
                            {title}
                        </h3>
                    </Link>
                </div>

                <SignedIn>
                    {showActionButton && (
                        <EditDeleteButton
                            type="Question"
                            itemId={JSON.stringify(_id)}
                        />
                    )}
                </SignedIn>
            </div>
            <div className="mt-3.5 flex flex-wrap gap-2">
                {tags.map((tag) => (
                    <RenderTag key={tag._id} _id={tag._id} name={tag.name} />
                ))}
            </div>
            <div className="flex-between mt-5 w-full flex-wrap gap-3">
                <Metric
                    imgUrl={author.picture}
                    alt="author"
                    value={author.name}
                    label="Author"
                    title={` - asked ${getTimeStamp(createdAt)}`}
                    href={`/profile/${author._id}`}
                    isAuthor={true}
                    textStyles="small-medium text-dark400_light700"
                />
                <Metric
                    imgUrl="/assets/icons/like.svg"
                    alt="upvotes"
                    value={formatLargeNumber(upvotes.length)}
                    label="Votes"
                    title=" Upvotes"
                    textStyles="small-medium text-dark400_light800"
                />
                <Metric
                    imgUrl="/assets/icons/message.svg"
                    alt="message"
                    value={formatLargeNumber(answers.length)}
                    label="Messages"
                    title=" Messages"
                    textStyles="small-medium text-dark400_light800"
                />
                <Metric
                    imgUrl="/assets/icons/eye.svg"
                    alt="eye"
                    value={formatLargeNumber(views)}
                    label="Views"
                    title=" Views"
                    textStyles="small-medium text-dark400_light800"
                />
            </div>
        </div>
    );
};

export default QuestionCard;
