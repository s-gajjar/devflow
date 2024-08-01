import {AnswerFilters} from "@/constants/filters";
import React from "react";
import Filters from "@/components/shared/Filters";
import {getAllAnswer} from "@/lib/actions/answer.action";

interface AllAnswersProps {
    questionId: string;
    userId: string;
    totalAnswers?: number;
    page?: number;
    filter?: number;
}

const AllAnswers = async({questionId, userId, totalAnswers, page, filter}: AllAnswersProps) => {

    const result = await getAllAnswer({
        questionId,
    })

    return (
        <div className="mt-11">
            <div className='flex items-center justify-between'>
                <h3 className="primary-text-gradient">{totalAnswers} Answers</h3>

                <Filters filters={AnswerFilters}/>
            </div>
            <div>
                {result.answers.map((answer) => (
                    <article
                        key={answer.id}
                        className="">

                    </article>
                ))}
            </div>
        </div>
    )
}

export default AllAnswers