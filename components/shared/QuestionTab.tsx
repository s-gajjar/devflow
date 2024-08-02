import {SearchParamsProps} from "@/types";
import {getUserQuestions} from "@/lib/actions/user.action";
import QuestionCard from "@/components/shared/cards/QuestionCard";

interface QuestionTabProps extends SearchParamsProps{
    userId: string,
    clerkId: string
}

const QuestionTab = async({ searchParams, userId, clerkId} : QuestionTabProps) => {

    const result = await getUserQuestions({userId, page: 1, pageSize: 20});


    return (
        <div>
            {result.questions.map((question) => (
                <QuestionCard
                    key={question._id}
                    _id={question._id}
                    clerkId={clerkId.toString()}
                    tags={question.tags}
                    author={question.author}
                    title={question.title}
                    upvotes={question.upvotes}
                    views={question.views}
                    answers={Array.isArray(question.answers) ? question.answers : undefined}
                    createdAt={question.createdAt}
                />
            ))}
        </div>
    )
}

export default QuestionTab