import LocalSearch from "@/components/shared/search/LocalSearch";
import Filters from "@/components/shared/Filters";
import {UserFilters} from "@/constants/filters";
import {getAllUsers} from "@/lib/actions/user.action";
import NoResult from "@/components/shared/NoResult";
import UserCard from "@/components/shared/cards/UserCard";
import {SearchParamsProps} from "@/types";
import Pagination from "@/components/shared/Pagination";
import Loading from "@/app/(root)/community/loading";

export const dynamic = 'force-dynamic';


const CommunityPage = async({ searchParams } : SearchParamsProps) => {

    const result = await getAllUsers({
        searchQuery: searchParams.q,
        filter: searchParams.filter,
        page: searchParams.page ? +searchParams.page : 1,
    });


    const isLoading = true;

    if (isLoading) {
        return <Loading />;
    }


    return (
        <>
            <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
                <h1 className="h1-bold text-dark100_light900">
                    All Users
                </h1>
            </div>
            <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
                <LocalSearch
                    route="/community"
                    iconPosition="left"
                    imgSrc="/assets/icons/search.svg"
                    placeholder="Search for a amazing minds here... "
                    otherClasses="flex-1"/>
                <Filters
                    filters={UserFilters}
                    otherClasses="min-h-[56px] sm:min-w-[170px]"
                />
            </div>
            <section className="mt-12 flex flex-wrap gap-4">
                {result.users && result.users.length > 0 ? (
                    result.users.map((user: {
                        _id: any;
                        clerkId?: string;
                        picture?: string;
                        name?: string;
                        username?: string;
                    }) => (
                        <UserCard key={user._id!}
                                  user={user}/>
                    ))
                ) : (
                    <NoResult
                        title="There's no users to show"
                        description=""
                        link="/sign-up"
                        linkTitle="Join to be the first!"
                    />
                )}
            </section>
            <div className="mt-10">
                <Pagination
                    pageNumber={searchParams?.page ? +searchParams.page : 1}
                    isNext={result.isNext!}/>
            </div>
        </>
    )
}
export default CommunityPage