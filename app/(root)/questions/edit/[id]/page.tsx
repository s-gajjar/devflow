import Question from "@/components/forms/Question";
import {auth} from "@clerk/nextjs/server";
import {redirect} from "next/navigation";
import {getUserById} from "@/lib/actions/user.action";
import {getQuestionById} from "@/lib/actions/question.action";
import {ParamsProps} from "@/types";


const Page = async({ params }: ParamsProps) => {

    const { userId } = auth();

    if (!userId) {
        redirect('/sign-in');
    }

    const mongoUser = await getUserById({ userId });
    const result = await getQuestionById({ questionId: params.id });

    return (
       <>
           <h1 className="h1-bold text-dark100_light900">Edit Question</h1>
           <div className="mt-9">
               <Question type="Edit" mongoUserId={mongoUser._id} questionDetails={JSON.stringify(result)} />
           </div>
       </>
    )
}

export default Page