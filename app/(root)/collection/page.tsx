import QuestionCard from "@/components/shared/cards/QuestionCard";
import {getSavedQuestions} from "@/lib/actions/user.action";
import {auth} from "@clerk/nextjs/server";
import {redirect} from "next/navigation";
import NoResult from "@/components/shared/NoResult";
import {SearchParamsProps} from "@/types";
import LocalSearch from "@/components/shared/search/LocalSearch";
import Filters from "@/components/shared/Filters";
import {QuestionFilters} from "@/constants/filters";

export default async function Collection({searchParams} : SearchParamsProps) {

    const { userId } = auth();

    if (!userId) {
        redirect('/sign-in');
    }

    const result = await getSavedQuestions({
        clerkId: userId,
        searchQuery: searchParams.q,
        filter: searchParams.filter,
    });

    if (!result.success) {
        console.error("Failed to get saved questions");
    }

    const savedQuestions = result.questions || [];

    return (
        <>
            <h1 className="h1-bold text-dark100_light900">Saved Questions</h1>

            <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
                <LocalSearch
                    route="/"
                    iconPosition="left"
                    imgSrc="/assets/icons/search.svg"
                    placeholder="Search for questions"
                    otherClasses="flex-1"
                />
                <Filters
                    filters={QuestionFilters}
                    otherClasses="min-h-[56px] sm:min-w-[170px]"/>
            </div>

            <div className="mt-10 flex w-full flex-col gap-6">
                {savedQuestions.length > 0 ? (
                    savedQuestions.map((question: any) => (
                        <QuestionCard
                            key={question._id}
                            _id={question._id}
                            tags={question.tags}
                            author={question.author}
                            title={question.title}
                            upvotes={question.upvotes}
                            views={question.views}
                            answers={Array.isArray(question.answers) ? question.answers : undefined}
                            createdAt={question.createdAt}
                        />
                    ))
                ) : (
                    <NoResult
                        title="There's no saved questions to show"
                        description="Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. Your query could be the next big thing others learn from. Get involved! 💡"
                        link="/ask-question"
                        linkTitle="Ask a Question"
                    />
                )}
            </div>
        </>
    );
}