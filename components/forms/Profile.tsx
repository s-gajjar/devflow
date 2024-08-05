"use client";

import {z} from "zod"
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"

import {Button} from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {Textarea} from "@/components/ui/textarea";
import {useState} from "react";
import {ProfileSchema} from "@/lib/validations";
import {usePathname, useRouter} from "next/navigation";
import {updateUser} from "@/lib/actions/user.action";

interface ProfileProps {
    clerkId: string;
    user: string;
}

const Profile = ({clerkId, user}: ProfileProps) => {

    const [isSubmitting, setisSubmitting] = useState(false);
    const parsedUser = JSON.parse(user);
    const router = useRouter();
    const pathname = usePathname();

    const form = useForm<z.infer<typeof ProfileSchema>>({
        resolver: zodResolver(ProfileSchema),
        defaultValues: {
            name: parsedUser.name || '',
            username: parsedUser.username || '',
            bio: parsedUser.bio || '',
            portfolioWebsite: parsedUser.portfolioWebsite || '',
            location: parsedUser.location || '',
        },
    })

    async function onSubmit(values: z.infer<typeof ProfileSchema>) {
        setisSubmitting(true);

        try{
            await updateUser({
                clerkId,
                updateData: {
                    name: values.name,
                    username: values.username,
                    bio: values.bio,
                    portfolioWebsite: values.portfolioWebsite,
                    location: values.location,
                },
                path: pathname
            })

            router.back();
        }catch(e){
            console.log(e)
        }finally{
            setisSubmitting(false);
        }

    }


    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex mt-9 w-full gap-9 flex-col">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({field}) => (
                            <FormItem className="space-y-3.5">
                                <FormLabel>Name<span className="text-primary-500">*</span></FormLabel>
                                <FormControl>
                                    <Input placeholder="Your name"
                                           className="no-focus paragraph-regularlight-border-2 background-light700_dark300 text-dark300_light700 min-h-[56px] border"
                                           {...field} />
                                </FormControl>

                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="username"
                        render={({field}) => (
                            <FormItem className="space-y-3.5">
                                <FormLabel>Username<span className="text-primary-500">*</span></FormLabel>
                                <FormControl>
                                    <Input placeholder="Your username"
                                           className="no-focus paragraph-regularlight-border-2 background-light700_dark300 text-dark300_light700 min-h-[56px] border"
                                           {...field} />
                                </FormControl>

                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="portfolioWebsite"
                        render={({field}) => (
                            <FormItem className="space-y-3.5">
                                <FormLabel>Portfolio Link</FormLabel>
                                <FormControl>
                                    <Input type="url"
                                           placeholder="Your Portfolio Link"
                                           className="no-focus paragraph-regularlight-border-2 background-light700_dark300 text-dark300_light700 min-h-[56px] border"
                                           {...field} />
                                </FormControl>

                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="location"
                        render={({field}) => (
                            <FormItem className="space-y-3.5">
                                <FormLabel>Location</FormLabel>
                                <FormControl>
                                    <Input placeholder="Where are you from?"
                                           className="no-focus paragraph-regularlight-border-2 background-light700_dark300 text-dark300_light700 min-h-[56px] border"
                                           {...field} />
                                </FormControl>

                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="bio"
                        render={({field}) => (
                            <FormItem className="space-y-3.5">
                                <FormLabel>Bio</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="What's special about you?"
                                           className="no-focus paragraph-regularlight-border-2 background-light700_dark300 text-dark300_light700 min-h-[56px] border"
                                           {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <div className="mt-7 flex justify-end">
                        <Button type="submit" className="primary-gradient w-fit !text-light-900" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    Saving...
                                </>
                            ) : (
                                "Save Changes"
                            )}
                        </Button>
                    </div>
                </form>
            </Form>

        </>
    )
}

export default Profile