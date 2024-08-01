import LocalSearch from "@/components/shared/search/LocalSearch";
import Filters from "@/components/shared/Filters";
import {QuestionFilters} from "@/constants/filters";
import QuestionCard from "@/components/shared/cards/QuestionCard";
import {getSavedQuestions} from "@/lib/actions/user.action";
import {auth} from "@clerk/nextjs/server";
import {redirect} from "next/navigation";
import NoResult from "@/components/shared/NoResult";

export default async function Home() {
    const { userId } = auth();
    console.log("User ID in Home component:", userId);

    if (!userId) {
        redirect('/sign-in');
    }

    const result = await getSavedQuestions({
        clerkId: userId,
    });
    console.log("Result from getSavedQuestions:", result);

    if (!result.success) {
        console.error("Failed to get saved questions");
    }

    const savedQuestions = result.questions || [];

    return (
        <>
            {/* ... (existing code) */}
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
                            createdAt={question.createdAt ? new Date(question.createdAt) : undefined}
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