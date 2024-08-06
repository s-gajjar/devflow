import {SearchParamsProps} from "@/types";
import {getUserQuestions} from "@/lib/actions/user.action";
import QuestionCard from "@/components/shared/cards/QuestionCard";
import Pagination from "@/components/shared/Pagination";

interface QuestionTabProps extends SearchParamsProps{
    userId: string,
    clerkId: string
}

const QuestionTab = async({ searchParams, userId, clerkId} : QuestionTabProps) => {

    const result = await getUserQuestions({
        userId,
        page: searchParams.page ? +searchParams.page : 1,
    });

    return (
        <>
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
            <div className="mt-10">
                <Pagination
                    pageNumber={searchParams?.page ? +searchParams.page : 1}
                    isNext={result.isNext!}/>
            </div>

        </>
    )
}

export default QuestionTab