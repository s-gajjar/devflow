import LocalSearch from "@/components/shared/search/LocalSearch";
import Filters from "@/components/shared/Filters";
import {TagFilters} from "@/constants/filters";
import NoResult from "@/components/shared/NoResult";
import {getAllTags} from "@/lib/actions/tag.action";
import Link from "next/link";
import {SearchParamsProps} from "@/types";

const TagsPage = async({ searchParams } : SearchParamsProps) => {

    const result = await getAllTags({
        searchQuery: searchParams.q,
        filter: searchParams.filter,
    });

    return (
        <>
            <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
                <h1 className="h1-bold text-dark100_light900">
                    Tags
                </h1>
            </div>
            <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
                <LocalSearch
                    route="/tags"
                    iconPosition="left"
                    imgSrc="/assets/icons/search.svg"
                    placeholder="Search by tag name... "
                    otherClasses="flex-1"/>
                <Filters
                    filters={TagFilters}
                    otherClasses="min-h-[56px] sm:min-w-[120px]"
                />
            </div>
            <section className="mt-12 flex flex-wrap gap-4">
                {result.tags && result.tags.length > 0 ? (
                    result.tags.map((tag) => (
                        <Link href={`/tags/${tag._id}`} key={tag._id}
                              className="shadow-light100_darknone w-full max-xs:min-w-full xs:w-[260px]">
                            <article className="background-light900_dark200 light-border flex w-full flex-col rounded-2xl border-px-8 py-10 sm:w-[260px] p-8">
                                <div className="background-light800_dark400 w-fit rounded-sm px-5 py-1.5">
                                    <p className="paragraph-semibold text-dark300_light900">
                                        {tag.name}
                                    </p>
                                </div>

                                <p className="small-medium text-dark400_light500 mt-2">
                                    <span className="body-semibold primary-text-gradient mr-1">{tag.questions.length}+</span> Question(s)
                                </p>
                            </article>
                        </Link>
                    ))
                ) : (
                    <NoResult
                        title="There's no tags to show"
                        description="It looks like there are no tags found."
                        link="/ask-question"
                        linkTitle="Ask a Question"/>
                )}
            </section>
        </>
    )
}

export default TagsPage