import Question from "@/components/forms/Question";
import {auth} from "@clerk/nextjs/server";
import {redirect} from "next/navigation";
import {getUserById} from "@/lib/actions/user.action";

const AskQuestion = async () => {

    // const {userId} = auth()
    const userId = '60c4d4e0-e3d7-4b7d-b2a3-c0d0e9f5b6d1'
    if (!userId) {
        redirect('/sign-in')
    }

    const mongoUser = await getUserById({userId})
    return (
        <div>
            <h1 className="h1-bold text-dark100_light900">Ask a Question</h1>
            <div className="mt-9">
                <Question mongoUserId={JSON.stringify(mongoUser._id)}/>
            </div>
        </div>
    );
};

export default AskQuestion;