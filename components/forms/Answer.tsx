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
import {createAnswer} from "@/lib/actions/answer.action";
import {usePathname} from "next/navigation";

interface AnswerProps {
    question: string;
    questionId: string;
    authorId: string;
}


const Answer = ({questionId, authorId}: AnswerProps) => {

    const {mode} = useTheme();
    const [isSubmitting, setisSubmitting] = useState(false);
    const editorRef = useRef(null);
    const pathname = usePathname();
    const form = useForm<z.infer<typeof AnswerSchema>>({
        resolver: zodResolver(AnswerSchema),
        defaultValues: {
            answer: ''
        }
    });

    const handleCreateAnswer = async (values: z.infer<typeof AnswerSchema>) => {
        setisSubmitting(true);
        try {
            const response = await createAnswer({
                answer: values.answer,
                author: authorId, // Directly use authorId without JSON.parse
                question: questionId, // Directly use questionId without JSON.parse
                path: pathname
            });

            console.log('Create answer response:', response);
            // You can now safely use response, as it contains only serializable data

            form.reset();

            if (editorRef.current) {
                const editor = editorRef.current as any;
                editor.setContent('');
            }

        } catch (e) {
            console.error("Error in handleCreateAnswer:", e);
            // Add user feedback here, like an error message
        } finally {
            setisSubmitting(false);
        }
    }

    /*
        const generateAIAnswer = async () => {
            if (!authorId) return;

            setIsSubmittingAI(true);

            try {
                const response = await fetch(`/api/claude`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        question: question,
                    }),
                });

                console.log('Response status:', response.status);

                const aiAnswer = await response.json();

                const formatteAnswer = aiAnswer.reply.replace(/\n/g, '<br/>');

                if (editorRef.current) {
                    const editor = editorRef.current as any;
                    editor.setContent(formatteAnswer);
                }

                console.log('AI Answer:', aiAnswer);

                if (aiAnswer.success) {
                    alert(aiAnswer.reply || 'No reply received');
                } else {
                    alert('Error: ' + (aiAnswer.error || 'Unknown error occurred'));
                }
            } catch (e) {
                console.error("Error in generateAIAnswer:", e);
                alert('An error occurred while generating the AI answer');
            } finally {
                setIsSubmittingAI(false);
            }
        }

    */
    return (
        <>
            <div>
                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-centersm:gap-2">
                    <h4 className="paragraph-semibold text-dark400_light800">Write your answer here</h4>
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
                                    disabled={isSubmitting}
                            >
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