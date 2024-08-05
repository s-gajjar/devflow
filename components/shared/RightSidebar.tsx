import Link from "next/link";
import Image from "next/image";
import RenderTag from "@/components/shared/RenderTag";
import {getHotQuestions} from "@/lib/actions/question.action";
import {getPopularTags} from "@/lib/actions/tag.action";

const RightSidebar = async () => {

    const hotQuestions = await getHotQuestions();
    const popularTags = await getPopularTags();


    return (
        <section className="background-light900_dark200 light-border sticky right-0 top-0 flex h-screen flex-col  overflow-y-auto
       border-l p-6 pt-36 shadow-light-300 dark:shadow-none max-xl:hidden w-[350px] custom-scrollbar">
            <div>
                <h3 className="h3-bold text-dark200_light900">Top Questions</h3>
                <div className="flex flex-col mt-7 gap-[30px] w-full">
                    {hotQuestions.map((question) => {
                        return (
                            <Link key={JSON.stringify(question._id)} href={`/questions/${question._id}`}
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
                    {popularTags.map((tags) => (
                        <RenderTag
                            _id={tags._id}
                            key={tags._id}
                            name={tags.name}
                            totalQuestions={1}
                            showCount={true}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default RightSidebar;

