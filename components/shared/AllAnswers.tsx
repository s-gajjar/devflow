import {AnswerFilters} from "@/constants/filters";
import React from "react";
import Filters from "@/components/shared/Filters";
import {getAllAnswer} from "@/lib/actions/answer.action";
import Link from "next/link";
import Image from "next/image";
import {getTimeStamp} from "@/lib/utils";
import ParseHTML from "@/components/shared/ParseHTML";
import Votes from "@/components/shared/Votes";
import Pagination from "@/components/shared/Pagination";


interface AllAnswersProps {
    questionId: string;
    userId: string;
    totalAnswers?: number;
    page?: number;
    filter?: string;
}

const AllAnswers = async ({questionId, userId, totalAnswers, page, filter}: AllAnswersProps) => {

    const result = await getAllAnswer({
        questionId,
        sortBy: filter,
        page: page ? +page : 1,
    })

    return (
        <div className="mt-11">
            <div className='flex items-center justify-between'>
                <h3 className="primary-text-gradient">{totalAnswers} Answer(s)</h3>

                <Filters filters={AnswerFilters}/>
            </div>
            <div>
                {result.answers.map((answer) => (
                    <article
                        key={answer.id}
                        className="light-border border-b py-10">
                        <div
                            className="mb-8 flex flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
                            <Link href={`/profile/${answer.author.clerkId}`} className="flex items-center gap-2">
                                <Image src={answer.author.picture} width={18} height={18} alt="author-profile"
                                       className="rounded-full"/>
                                <p className="body-semibold text-dark300_light700">{answer.author.name}</p>

                                <p className="small-regular text-light400_light500 ml-0.5 line-clamp-1">
                                        <span
                                            className="max-sm:hidden">  answered {""} {getTimeStamp(answer.createdAt)}</span>
                                </p>
                            </Link>
                            <div className="flex justify-end">
                                <Votes
                                    type="Answer"
                                    itemId={answer._id.toString()}
                                    userId={userId.toString()}
                                    upvotes={answer.upvotes.length}
                                    hasupVoted={answer.upvotes.includes(userId)}
                                    downvotes={answer.downvotes.length}
                                    hasdownVoted={answer.downvotes.includes(userId)}
                                />
                            </div>
                        </div>
                        <ParseHTML data={answer.answer}/>
                    </article>
                ))}
            </div>
            <div className="mt-10">
                <Pagination
                    pageNumber={page ? +page : 1}
                    isNext={result.isNext!}/>
            </div>
        </div>
    )
}

export default AllAnswers