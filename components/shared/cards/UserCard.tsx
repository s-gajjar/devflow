import Image from "next/image";
import Link from "next/link";
import {getTopInteractedTags} from "@/lib/actions/tag.action";
import {Badge} from "@/components/ui/badge";

interface UserCardProps {
    user: {
        _id: string;
        clerkId: string;
        picture: string;
        name: string;
        username: string;
    }
}


const UserCard = async ({
                            user
                        }: UserCardProps) => {

    const interactedTags = await getTopInteractedTags({userId: user._id!});

    // @ts-ignore
    return (
        <Link href={`/profile/${user.clerkId}`}
              className="shadow-light100_darknone w-full max-xs:min-w-full xs:w-[260px]">
            <article
                className="background-light900_dark200 light-border flex w-full flex-col items-center justify-center rounded-2xl border p-8">
                <Image src={user.picture} height={100} width={100} alt="author"
                       className="object-contain rounded-full"/>
                <div className="mt-4 text-center">
                    <h3 className="h3-bold text-dark200_light900 line-clamp-1">
                        {user.name}
                    </h3>
                    <p className="body-regular text-dark500_light500 mt-2">@{user.username}</p>
                </div>
                <div className="mt-5">
                    {interactedTags.tags.length > 0 ? (
                        interactedTags.tags.map((tag) => (
                            <div key={tag._id} className="flex items-center gap-2">
                                <p className="small-medium text-dark400_light700">{tag.name}</p>
                                <p className="small-medium text-dark400_light700">{tag.totalQuestions}</p>
                            </div>
                        ))
                    ) : (
                        <Badge variant="outline">
                            No tags
                        </Badge>
                    )}
                </div>
            </article>
        </Link>
    );
}

export default UserCard;