import {formatLargeNumber} from "@/lib/utils";
import Image from "next/image";

const StatsCard = ({imgUrl, value, title}: { imgUrl: string, value: number, title: string }) => {
    return (
        <div className="light-border background-light900_dark300 flex flex-wrap items-center justify-start gap-4 rounded-md border p-6 shadow-light-300
                 dark:border-dark-200">
            <Image src={imgUrl} width={40} height={50} alt={title}/>
            <div>
                <p className="paragraph-medium text-dark200_light900">{value}</p>
                <p className="body-medium text-dark200_light900">{title}</p>
            </div>
        </div>
    )
}

interface StatsProps {
    totalQuestions: number,
    totalAnswers: number
}

const Stats = ({totalQuestions, totalAnswers}: StatsProps) => {
    return (
        <div className="mt-10">
            <h4 className="h3-semibold text-dark200_light900">Stats</h4>
            <div className="mt-5 grid grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-4">
                <div className="light-border background-light900_dark300 flex flex-wrap items-center justify-evenly gap-4 rounded-md border p-6 shadow-light-300
                 dark:border-dark-200">
                    <div className="flex flex-col items-center">
                        <p className="paragraph-medium text-dark200_light900">{formatLargeNumber(totalQuestions)}</p>
                        <p className="body-medium text-dark200_light900">Questions</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <p className="paragraph-medium text-dark200_light900">{formatLargeNumber(totalAnswers)}</p>
                        <p className="body-medium text-dark200_light900">Answers</p>
                    </div>
                </div>
                <StatsCard
                    imgUrl="/assets/icons/gold-medal.svg"
                    value={0}
                    title="Gold Badges"/>
                <StatsCard
                    imgUrl="/assets/icons/silver-medal.svg"
                    value={0}
                    title="Silver Badges"/>
                <StatsCard
                    imgUrl="/assets/icons/bronze-medal.svg"
                    value={0}
                    title="Bronze Badges"/>
            </div>
        </div>
    )
}

export default Stats