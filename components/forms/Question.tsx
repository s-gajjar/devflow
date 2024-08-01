"use client";

import React, {useRef, useState} from 'react';
import {Editor} from '@tinymce/tinymce-react';
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"
import {Button} from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {QuestionSchema} from "@/lib/validations";
import {Badge} from "@/components/ui/badge";
import Image from "next/image";
import {createQuestion} from "@/lib/actions/question.action";
import {usePathname, useRouter} from "next/navigation";
import {useTheme} from "@/context/ThemeProvider";

const type: any= 'create'

interface QuestionProps {
    mongoUserId: string;
}


const Question = ({ mongoUserId }: QuestionProps) => {
    const {mode} = useTheme();
    const editorRef = useRef(null);
    const [isSubmitting, setisSubmitting] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const form = useForm<z.infer<typeof QuestionSchema>>({
        resolver: zodResolver(QuestionSchema),
        defaultValues: {
            title: "",
            explanation: "",
            tags: []
        },
    })

    async function onSubmit(values: z.infer<typeof QuestionSchema>) {
        setisSubmitting(true);

        try{
            await createQuestion({
                title: values.title,
                explanation: values.explanation,
                tags: values.tags,
                author: JSON.parse(mongoUserId),
                path: pathname,
            });

            router.push("/");
        }catch(e){
            console.log(e)
        }finally{
            setisSubmitting(false);
        }

    }

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, field: any) => {
        if (e.key === 'Enter' && field.name === 'tags') {
            e.preventDefault();
            const tagInput = e.target as HTMLInputElement;
            const tagValue = tagInput.value.trim();

            if (tagValue !== '') {
                if (tagValue.length > 15) {
                    return form.setError('tags', {type: 'required', message: 'Tags must be less than 15 characters'});
                }

                // Ensure field.value is always an array
                const currentTags = Array.isArray(field.value) ? field.value : [];

                if (!currentTags.includes(tagValue)) {
                    form.setValue('tags', [...currentTags, tagValue]);
                    tagInput.value = '';
                    form.clearErrors('tags');
                } else {
                    form.trigger();
                }
            }
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col gap-10">
                <FormField
                    control={form.control}
                    name="title"
                    render={({field}) => (
                        <FormItem className="flex w-full flex-col">
                            <FormLabel className="paragraph-semibold text-dark400_light800">Question Title <span
                                className="text-primary-500">*</span></FormLabel>
                            <FormControl className="mt-3.5">
                                <Input
                                    className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[54px] border"
                                    {...field} />
                            </FormControl>
                            <FormDescription className="body-regular mt-2.5 text-light-500">
                                Be specific and imagine you&apos;re asking a question to another person.
                            </FormDescription>
                            <FormMessage className="text-red-500"/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="explanation"
                    render={({field}) => (
                        <FormItem className="flex w-full flex-col  gap-3">
                            <FormLabel className="paragraph-semibold text-dark400_light800">Detailed explanation of your
                                question <span className="text-primary-500">*</span></FormLabel>
                            <FormControl className="mt-3.5">
                                <Editor
                                    apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
                                    onInit={(_evt, editor) => {
                                        //  @ts-ignore
                                        editorRef.current = editor
                                    }}
                                    onBlur={field.onBlur}
                                    initialValue=""
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
                            <FormDescription className="body-regular mt-2.5 text-light-500">
                                Introduce the problem and expand on what you put in the title. Minimum 20 characters.
                            </FormDescription>
                            <FormMessage className="text-red-500"/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="tags"
                    render={({field}) => (
                        <FormItem className="flex w-full flex-col">
                            <FormLabel className="paragraph-semibold text-dark400_light800">Tags <span
                                className="text-primary-500">*</span></FormLabel>
                            <FormControl className="mt-3.5">
                                <>
                                    <Input
                                        className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[54px] border"
                                        placeholder="Add tags..."
                                        onKeyDown={(e) => handleInputKeyDown(e, field)}
                                    />
                                    {Array.isArray(field.value) && field.value.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-2.5">
                                            {field.value.map((tag: string) => (
                                                <Badge key={tag} className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium capitalize
                                                bg-gray-200 text-gray-800 rounded-md dark:bg-gray-700 dark:text-gray-200">
                                                    {tag}
                                                    <Image
                                                        src="/assets/icons/close.svg"
                                                        alt="Close icon"
                                                        width={12}
                                                        height={12}
                                                        className="cursor-pointer object-contain"
                                                        onClick={() => {
                                                            const newTags = field.value.filter((t: string) => t !== tag);
                                                            form.setValue('tags', newTags);
                                                        }}
                                                    />
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </>
                            </FormControl>
                            <FormDescription className="body-regular mt-2.5 text-light-500">
                                Add up to 3 tags to categorize your question.
                            </FormDescription>
                            <FormMessage className="text-red-500"/>
                        </FormItem>
                    )}
                />
                <Button type="submit" className="primary-gradient w-fit !text-light-900" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <>
                            {type === 'edit' ? 'Editing...' : 'Posting...'}
                        </>
                    ):(
                        type === 'edit' ? 'Edit Question' : 'Ask a Question'
                        )}
                </Button>
            </form>
        </Form>
    )
}

export default Question