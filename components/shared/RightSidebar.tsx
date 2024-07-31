import Link from "next/link";
import Image from "next/image";
import RenderTag from "@/components/shared/RenderTag";

const RightSidebar = () => {
    const hotQuestions = [
        {
            id: "1",
            title: "What is the best way to learn web development?",
        },
        {
            id: "2",
            title: "What is the best way to learn web development?",
        },
        {
            id: "3",
            title: "What is the best way to learn web development?",
        },
        {
            id: "4",
            title: "What is the best way to learn web development?",
        },
    ];

    const popularTags = [
        {
            _id: "1",
            name: "javascript",
            totalQuestions: 10,
        },
        {
            _id: "2",
            name: "react",
            totalQuestions: 20,
        },
        {
            _id: "3",
            name: "nextjs",
            totalQuestions: 30,
        },
        {
            _id: "4",
            name: "tailwindcss",
            totalQuestions: 40,
        },

    ];

    return (
        <section className="background-light900_dark200 light-border sticky right-0 top-0 flex h-screen flex-col  overflow-y-auto
       border-l p-6 pt-36 shadow-light-300 dark:shadow-none max-xl:hidden w-[350px] custom-scrollbar">
            <div>
                <h3 className="h3-bold text-dark200_light900">Top Questions</h3>
                <div className="flex flex-col mt-7 gap-[30px] w-full">
                    {hotQuestions.map((question) => {
                        return (
                            <Link key={question.id} href={`/questions/${question.id}`}
                                  className="flex items-center justify-between gap-4 ">
                                <p className="body-medium text-dark500_light700">{question.title}</p>
                                <Image src="/assets/icons/chevron-right.svg" width={20} height={20}
                                       className="invert-colors" alt="Chevron Right Icon"/>
                            </Link>
                        )
                    })}
                </div>
            </div>
            <div className="mt-16">
                <h3 className="h3-bold text-dark200_light900">Popular Tags</h3>
                <div className="mt-7 flex flex-col gap-4">
                    {popularTags.map((tag) => {
                        return (
                            <div key={tag._id} className="flex items-center justify-between gap-4 ">
                                <RenderTag _id={tag._id} name={tag.name}/>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

export default RightSidebar;

