"use client";

import Image from "next/image";
import {formatLargeNumber} from "@/lib/utils";
import {downvoteQuestion, upvoteQuestion} from "@/lib/actions/question.action";
import {usePathname, useRouter} from "next/navigation";
import {downvoteAnswer, upvoteAnswer} from "@/lib/actions/answer.action";
import {toggleSaveQuestion} from "@/lib/actions/user.action";
import {useEffect} from "react";
import {viewQuestion} from "@/lib/actions/interaction.action";

interface VotesProps {
    type: string;
    itemId: string;
    userId: string;
    upvotes: number;
    hasupVoted: boolean;
    downvotes: number;
    hasdownVoted: boolean;
    hasSaved?: boolean;
}

const Votes = ({
                   type,
                   itemId,
                   userId,
                   upvotes,
                   hasupVoted,
                   downvotes,
                   hasdownVoted,
                   hasSaved,
               }: VotesProps) => {
    const path = usePathname();
    const router = useRouter();

    const handleSave = async () => {
        await toggleSaveQuestion({
            userId,
            questionId: itemId,
            path
        })
    }

    const handleVote = async (action: string) => {
        if (!userId) return;

        if (action === 'upvote') {
            if (type === 'Question') {
                await upvoteQuestion({
                    questionId: itemId,
                    userId: userId,
                    path: path,
                    hasupVoted,
                    hasdownVoted
                });
            } else if (type === 'Answer') {
                await upvoteAnswer({
                    answerId: itemId,
                    userId: userId,
                    path: path,
                    hasupVoted,
                    hasdownVoted
                });
            }
        } else if (action === 'downvote') {
            if (type === 'Question') {
                await downvoteQuestion({
                    questionId: itemId,
                    userId: userId,
                    path: path,
                    hasupVoted,
                    hasdownVoted
                });
            } else if (type === 'Answer') {
                await downvoteAnswer({
                    answerId: itemId,
                    userId: userId,
                    path: path,
                    hasupVoted,
                    hasdownVoted
                });
            }
        }
        // Optionally refresh the page or state to reflect the updated votes
        router.refresh();
    }


    useEffect(() => {
        viewQuestion({
            questionId: itemId,
            userId: userId ? userId : undefined,
        })
    },[itemId, userId, path, router]);

    return (
        <div className="flex gap-5">
            <div className="flex-center gap-2.5">
                <div className="flex-center gap-1.5">
                    <Image
                        src={hasupVoted ? "/assets/icons/upvoted.svg" : "/assets/icons/upvote.svg"}
                        width={18}
                        height={18}
                        className="cursor-pointer"
                        alt="upvote icon"
                        onClick={() => handleVote('upvote')}/>

                    <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
                        <p className="subtle-medium text-dark400_light700">
                            {formatLargeNumber(upvotes)}
                        </p>
                    </div>
                </div>
                <div className="flex-center gap-1.5">
                    <Image
                        src={hasdownVoted ? "/assets/icons/downvoted.svg" : "/assets/icons/downvote.svg"}
                        width={18}
                        height={18}
                        className="cursor-pointer"
                        alt="downvote icon"
                        onClick={() => handleVote('downvote')}/>
                    <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
                        <p className="subtle-medium text-dark400_light700">
                            {formatLargeNumber(downvotes)}
                        </p>
                    </div>
                </div>
            </div>
            {type === 'Question' && (
                <Image
                    src={hasSaved ? "/assets/icons/star-filled.svg" : "/assets/icons/star-red.svg"}
                    width={18}
                    height={18}
                    className="cursor-pointer"
                    alt="downvote icon"
                    onClick={handleSave}/>
            )}
        </div>
    )
};

export default Votes;