import React from "react";
import {getQuestionById} from "@/lib/actions/question.action";
import Image from "next/image";
import Link from "next/link";
import Metric from "@/components/shared/Metric";
import {formatLargeNumber, getTimeStamp} from "@/lib/utils";
import ParseHTML from "@/components/shared/ParseHTML";
import RenderTag from "@/components/shared/RenderTag";
import Answer from "@/components/forms/Answer";
import {auth} from "@clerk/nextjs/server";
import {getUserById} from "@/lib/actions/user.action";
import AllAnswers from "@/components/shared/AllAnswers";
import Votes from "@/components/shared/Votes";

const QuestionPage = async ({params, searchParams}: any) => {
    const result = await getQuestionById({questionId: params.id});
    if (!result) {
        return <div>Question not found</div>;
    }

    const {userId: clerkId} = auth()
    let mongoUser;
    if (clerkId) {
        mongoUser = await getUserById({userId: clerkId})
    }
    return (
        <>
            <div className="flex-start w-full flex-col">
                <div
                    className="flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
                    <Link href={`/profile/${result.author.clerkId}`} className="flex items-center gap-2">
                        <Image src={result.author.picture} width={22} height={22} alt="author"
                               className="rounded-full"/>
                        <p className="paragraph-semibold text-dark300_light700">{result.author.name}</p>
                    </Link>
                    <div className="flex justify-end">
                        <Votes
                            type="question"
                            itemId={JSON.stringify(result._id)}
                            userId={JSON.stringify(mongoUser._id)}
                            upvotes={result.upvotes.length}
                            hasupVoted={result.upvotes.includes(mongoUser._id)}
                            downvotes={result.downvotes.length}
                            hasdownVoted={result.downvotes.includes(mongoUser._id)}
                            hasSaved={mongoUser?.saved.includes(result._id)}
                        />
                    </div>
                </div>
                <h2 className="h2-semibold text-dark200_light900 mt-2.5 w-full text-left">
                    {result.title}
                </h2>
            </div>
            <div className="flex flex-wrap gap-4 mb-8 mt-5">
                <Metric
                    imgUrl="/assets/icons/clock.svg"
                    alt="clock icon"
                    value={` asked ${getTimeStamp(result.createdAt)}`}
                    label="Votes"
                    textStyles="small-medium text-dark400_light800"
                />
                <Metric
                    imgUrl="/assets/icons/message.svg"
                    alt="message"
                    value={formatLargeNumber(result.answers.length)}
                    label="Messages"
                    title=" Messages"
                    textStyles="small-medium text-dark400_light800"
                />
                <Metric
                    imgUrl="/assets/icons/eye.svg"
                    alt="eye"
                    value={formatLargeNumber(result.views)}
                    label="Views"
                    title=" Views"
                    textStyles="small-medium text-dark400_light800"
                />

            </div>
            <ParseHTML data={result.explanation || 'Hello'}/>

            <div className="my-8 flex flex-wrap gap-4">
                {result.tags.map((tag) => (
                        <RenderTag
                            _id={tag._id}
                            key={tag._id}
                            name={tag.name}
                            showCount={false}
                        />
                    )
                )}
            </div>

            <AllAnswers
                questionId={result._id}
                userId={JSON.stringify(mongoUser._id)}
                totalAnswers={result.answers.length}
            />

            <div className="mt-10">
                <Answer
                    question={result.explanation}
                    questionId={JSON.stringify(result._id)}
                    authorId={JSON.stringify(mongoUser._id)}/>
            </div>
        </>

    )
}

export default QuestionPage