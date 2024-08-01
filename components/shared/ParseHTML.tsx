"use client";

import React, {useEffect} from "react";
import Prism from "prismjs";
import parse from "html-react-parser";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";


interface ParseHTMLProps {
    data: string;
}

const ParseHTML = ({data}: ParseHTMLProps) => {


    useEffect(() => {
        Prism.highlightAll();
    }, []);

    return (
        <div>
            {parse(data)}
        </div>
    )
}

export default ParseHTML;