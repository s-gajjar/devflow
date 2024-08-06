import {SearchParamsProps} from "@/types";
import {getUsersAnswers} from "@/lib/actions/user.action";
import AnswerCard from "@/components/shared/cards/AnswerCard";
import Pagination from "@/components/shared/Pagination";


interface AnswersTabProps extends SearchParamsProps {
    userId: string,
    clerkId: string
}


const AnswersTab = async ({searchParams, userId, clerkId}: AnswersTabProps) => {

    const result = await getUsersAnswers({
        userId,
        page: searchParams.page ? +searchParams.page : 1,
    });

    return (
        <>
            {result.answers.map((answer) => (
                <AnswerCard
                    key={answer._id}
                    _id={answer._id}
                    question={answer.question}
                    author={answer.author}
                    upvotes={answer.upvotes}
                    createdAt={answer.createdAt}
                />
            ))}
            <div className="mt-10">
                <Pagination
                    pageNumber={searchParams?.page ? +searchParams.page : 1}
                    isNext={result.isNext!}/>
            </div>

        </>
    )
}

export default AnswersTab