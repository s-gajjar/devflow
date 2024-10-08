import Link from "next/link";
import { Button } from "@/components/ui/button";
import LocalSearch from "@/components/shared/search/LocalSearch";
import Filters from "@/components/shared/Filters";
import { HomePageFilters } from "@/constants/filters";
import HomeFilters from "@/components/home/HomeFilters";
import NoResult from "@/components/shared/NoResult";
import QuestionCard from "@/components/shared/cards/QuestionCard";
import {getQuestions, getRecommendedQuestions} from "@/lib/actions/question.action";
import {SearchParamsProps} from "@/types";
import Pagination from "@/components/shared/Pagination";
import type {Metadata} from "next";
import {auth} from "@clerk/nextjs/server";


export const metadata: Metadata = {
    title: "Home | DevOverflow",
    description: "A community for developers to share their knowledge and experiences.",
    icons: {
        icon: "/assets/images/site-logo.svg",
    }
};

export const dynamic = 'force-dynamic';

export default async function Home({searchParams} : SearchParamsProps) {
    const { userId } = auth();
    let result;

    if(searchParams?.filter === 'recommended'){
        if(userId){
            result = await getRecommendedQuestions({
                userId,
                page: searchParams.page ? +searchParams.page : 1,
                searchQuery: searchParams.q,
            });
        }else{
            result = {
                questions: [],
                isNext: false
            }
        }
    }else{
        result = await getQuestions({
            searchQuery: searchParams.q,
            filter: searchParams.filter,
            page: searchParams.page ? +searchParams.page : 1,
        });
    }



    return (
        <>
            <div className="flex w-full justify-between gap-4 sm:flex-row">
                <h1 className="h1-bold text-dark100_light900 whitespace-nowrap">
                    All Questions
                </h1>

                <Link href="/ask-question" className="flex justify-end max-sm:w-full">
                    <Button className="primary-gradient min-h-[46px] !text-light-900 px-4 py-3">Ask a Question</Button>
                </Link>
            </div>

            <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
                <LocalSearch
                    route="/"
                    iconPosition="left"
                    imgSrc="/assets/icons/search.svg"
                    placeholder="Search for questions"
                    otherClasses="flex-1"/>
                <Filters
                    filters={HomePageFilters}
                    otherClasses="min-h-[56px]"
                    containerClasses="hidden max-md:flex"/>
            </div>
            <HomeFilters/>

            <div className="mt-10 flex w-full flex-col gap-2">
                {result.questions && result.questions.length > 0 ? (
                    result.questions.map((question) => (
                        question && question._id ? (
                            <QuestionCard
                                key={question._id as string}
                                _id={question._id as string}
                                tags={question.tags}
                                author={question.author}
                                title={question.title}
                                upvotes={question.upvotes}
                                views={question.views}
                                answers={Array.isArray(question.answers) ? question.answers : []}
                                createdAt={question.createdAt ? new Date(question.createdAt) : new Date()}
                            />
                        ) : null
                    ))
                ) : (
                    <NoResult
                        title="There's no questions to show"
                        description="Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. Your query could be the next big thing others learn from. Get involved! 💡"
                        link="/ask-question"
                        linkTitle="Ask a Question"
                    />
                )}
            </div>
            <div className="mt-10">
                <Pagination
                    pageNumber={searchParams?.page ? +searchParams.page : 1}
                    isNext={result.isNext}/>
            </div>
        </>
    );
}
