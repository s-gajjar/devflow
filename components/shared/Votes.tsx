"use client";

interface VotesProps {
    type: string;
    itemId: string;
    userId: string;
    upvotes: number;
    hasupVoted: boolean;
    downvotes: number;
    hasdownVoted: boolean;
    hasSaved: boolean;
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
    return(
        <div>
            vote
        </div>
    )
};

export default Votes;