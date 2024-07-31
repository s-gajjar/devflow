"use client";

import React, {useRef, useState} from "react";
import {z} from "zod";
import {Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form";
import {useForm} from "react-hook-form";
import {AnswerSchema} from "@/lib/validations";
import {zodResolver} from "@hookform/resolvers/zod";
import {Editor} from "@tinymce/tinymce-react";
import {useTheme} from "@/context/ThemeProvider";
import {Button} from "@/components/ui/button";
import Image from "next/image";

const Answer = () => {

    const {mode} = useTheme();
    const [isSubmitting, setisSubmitting] = useState(false);
    const editorRef = useRef(null);

    const form = useForm<z.infer<typeof AnswerSchema>>({
        resolver: zodResolver(AnswerSchema),
        defaultValues: {
            answer: ''
        }
    });

    const handleCreateAnswer = (values: z.infer<typeof AnswerSchema>) => {
        console.log(values)
    }

    return (
        <>
            <div>
                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-centersm:gap-2">
                    <h4 className="paragraph-semibold text-dark400_light800">Write your answer here</h4>
                    <Button type="submit"
                            disabled={isSubmitting}
                            className="btn light-border-2 gap1.5 rounded-md px-4 w-fit py-2.5 text-primary-500 shadow-none"
                            onClick={() => {
                                console.log('clicked')
                            }}>
                        <Image src="/assets/icons/stars.svg" width={12} height={12} className="object-contain mr-2"
                               alt="Star Icon"/>
                        Generate an AI Answer
                    </Button>
                </div>
                <Form {...form}>
                    <form
                        className="mt-6 flex w-full flex-col gap-10"
                        onSubmit={form.handleSubmit(handleCreateAnswer)}>
                        <FormField
                            control={form.control}
                            name="answer"
                            render={({field}) => (
                                <FormItem className="flex w-full flex-col  gap-3">
                                    <FormControl className="mt-3.5">
                                        <Editor
                                            apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
                                            onInit={(_evt, editor) => {
                                                //  @ts-ignore
                                                editorRef.current = editor
                                            }}
                                            onBlur={field.onBlur}
                                            onEditorChange={(content) => field.onChange(content)}
                                            init={{
                                                height: 500,
                                                menubar: false,
                                                plugins: [
                                                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                                    'anchor', 'searchreplace codesample', 'visualblocks', 'fullscreen',
                                                    'insertdatetime', 'media', 'table', 'codesample',
                                                ],
                                                toolbar: 'undo redo | blocks | ' +
                                                    'bold italic forecolor | alignleft aligncenter ' +
                                                    'alignright alignjustify | bullist numlist |' +
                                                    'codesample ',
                                                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }',
                                                skin: mode === 'dark' ? 'oxide-dark' : 'oxide',
                                                content_css: mode === 'dark' ? 'dark' : 'light',

                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-500"/>
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end">
                            <Button type="submit" className="primary-gradient w-fit !text-light-900"
                                    disabled={isSubmitting}>
                                {isSubmitting ? 'Submitting...' : 'Submit Answer'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>

        </>
    )
}

export default Answer