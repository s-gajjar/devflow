"use client";

import { useState } from 'react';

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
    const [upvoteCount, setUpvoteCount] = useState(upvotes);
    const [downvoteCount, setDownvoteCount] = useState(downvotes);
    const [userHasUpvoted, setUserHasUpvoted] = useState(hasupVoted);
    const [userHasDownvoted, setUserHasDownvoted] = useState(hasdownVoted);
    const [isSaved, setIsSaved] = useState(hasSaved);

    const handleVote = async (voteType: 'upvote' | 'downvote') => {
        // Implement your voting logic here
        // Update the state accordingly
    };

    const handleSave = async () => {
        // Implement your save logic here
        // Update the state accordingly
    };

    return (
        <div className="flex items-center gap-4">
            <button
                onClick={() => handleVote('upvote')}
                className={`flex items-center ${userHasUpvoted ? 'text-blue-500' : ''}`}
            >
                <span>▲</span>
                <span>{upvoteCount}</span>
            </button>
            <button
                onClick={() => handleVote('downvote')}
                className={`flex items-center ${userHasDownvoted ? 'text-red-500' : ''}`}
            >
                <span>▼</span>
                <span>{downvoteCount}</span>
            </button>
            <button
                onClick={handleSave}
                className={`flex items-center ${isSaved ? 'text-yellow-500' : ''}`}
            >
                <span>★</span>
                <span>Save</span>
            </button>
        </div>
    );
};

export default Votes;