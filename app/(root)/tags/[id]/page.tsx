import {GetQuestionsByTagId} from "@/lib/actions/tag.action";
import LocalSearch from "@/components/shared/search/LocalSearch";
import QuestionCard from "@/components/shared/cards/QuestionCard";
import NoResult from "@/components/shared/NoResult";
import {URLProps} from "@/types";

const Page = async ({params, searchParams}: URLProps) => {

    const result = await GetQuestionsByTagId({
        tagId: params.id,
        page: searchParams.page ? parseInt(searchParams.page) : 1,
        searchQuery: searchParams.searchQuery,
    });

    // @ts-ignore
    return (
        <>
            <h1 className="h1-bold text-dark100_light900">
                {result.tagTitle}
            </h1>
            <div className="mt-11 w-full">
                <LocalSearch
                    route="/"
                    iconPosition="left"
                    imgSrc="/assets/icons/search.svg"
                    placeholder="Search tag questions"
                    otherClasses="flex-1"/>

            </div>

            <div className="mt-10 flex w-full flex-col gap-6">
                {result.questions.length > 0 ? (
                    result.questions.map((question) => (
                        <QuestionCard
                            key={question._id as string}
                            _id={question._id as string}
                            tags={question.tags}
                            author={question.author}
                            title={question.title}
                            upvotes={question.upvotes}
                            views={question.views}
                            answers={question.answers}
                            createdAt={question.createdAt}
                        />
                    ))
                ) : (
                    <NoResult
                        title="There's no tags to show"
                        description="Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. Your query could be the next big thing others learn from. Get involved! 💡"
                        link="/ask-question"
                        linkTitle="Ask a Question"
                    />
                )}
            </div>
        </>
    );
};

export default Page;