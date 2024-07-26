import Link from "next/link";
import {Button} from "@/components/ui/button";
import LocalSearch from "@/components/shared/search/LocalSearch";
import Filters from "@/components/shared/Filters";
import {HomePageFilters} from "@/constants/filters";
import HomeFilters from "@/components/home/HomeFilters";
import NoResult from "@/components/shared/NoResult";
import QuestionCard from "@/components/shared/cards/QuestionCard";

const questions = [
    {
        _id: "1",
        title: "Question 1",
        tags: [{_id: 1, name: "javascript"}, {_id: 2, name: "react"}, {_id: 3, name: "nextjs"}, {
            _id: 4,
            name: "tailwindcss"
        }],
        author: {
            _id: "1",
            name: "John Doe",
            picture: "/assets/images/avatar.png"
        },
        upvotes: 10,
        views: 10,
        answers: 10,
        createdAt: "2023-03-01T00:00:00.000Z",
    },
    {
        _id: "2",
        title: "Question 2",
        tags: [{_id: 1, name: "javascript"}, {_id: 2, name: "react"}, {_id: 3, name: "nextjs"}, {
            _id: 4,
            name: "tailwindcss"
        }],
        author: {
            _id: "1",
            name: "John Doe",
            picture: "/assets/images/avatar.png"
        },
    }

];


export default function Home() {

    return (
        <>
            <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
                <h1 className="h1-bold text-dark100_light900">
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

            <div className="mt-10 flex w-full flex-col gap-6">
                {questions.length > 0 ?
                    questions.map((question) => (
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
                    : <NoResult
                        title="There's no questions to show"
                        description={"Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. our query could be the next big thing others learn from. Get involved! 💡"}
                        link="/ask-question"
                        linkTitle="Ask a Question"
                    />
                }
            </div>
        </>
    )
        ;
}