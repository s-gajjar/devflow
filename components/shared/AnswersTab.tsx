import {SearchParamsProps} from "@/types";
import {getUsersAnswers} from "@/lib/actions/user.action";
import AnswerCard from "@/components/shared/cards/AnswerCard";


interface AnswersTabProps extends SearchParamsProps {
    userId: string,
    clerkId: string
}


const AnswersTab = async ({searchParams, userId, clerkId}: AnswersTabProps) => {

    const result = await getUsersAnswers({userId, page: 1, pageSize: 20});

    return (
        <div>
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
        </div>
    )
}

export default AnswersTab