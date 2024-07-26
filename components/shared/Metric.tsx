import Image from "next/image";
import Link from "next/link";

interface MetricProps {
    imgUrl: string;
    title?: string;
    alt: string;
    value?: number | string;
    label: string;
    href?: string;
    isAuthor?: boolean;
    textStyles?: string;
}

const Metric = ({
    imgUrl,
    title,
    alt,
    value,
    label,
    href,
    isAuthor,
    textStyles,
                  }: MetricProps) => {

    const metricContent = (
        <>
            <Image
                src={imgUrl}
                width={20}
                height={20}
                alt={alt}
                className={`object-contain ${href ? 'rounded-full' : ''} `}/>

            <p className={`${textStyles} flex items-center gap-1`}>
                {value}

                <span className={`small-regular line-clamp-1 ${isAuthor ? 'max-sm:hidden' : ''}`}>
                    {title}
                </span>
            </p>
        </>
    )

    if(href){
        return(
            <Link href={href} className="flex items-center gap-2">
                {metricContent}
            </Link>
        )
    }

    return (
        <div className="flex-center flex-wrap gap-1">
            {metricContent}
        </div>
    )
}

export default Metric