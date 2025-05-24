"use client";
import { RequiredFieldError } from "@/components/group/error";
import { useToast } from "@/hooks/use-toast";
import { DEFAULT_AUTH_FORM_DATA_ERROR, DEFAULT_AUTH_FORM_DATA_FIELDS, DEFAULT_AUTH_INPUT_SUBMITTING } from "@/lib/constants/authForms";
import { useAuth } from "@/lib/hooks/useAuth";
import { AuthFormDataError, AuthFormDataFields, AuthFormDataTarget, AuthInputSubmitting } from "@/lib/types/authForms";
import { handleEmailOnChange, handlepasswordOnChange, handleUsernameOnChange } from "@/lib/utils/authForms";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function Login() {
    const router = useRouter()
    const { login } = useAuth()
    const { toast } = useToast()
    const [formsInput, setFormsInput] = useState<AuthFormDataFields>(DEFAULT_AUTH_FORM_DATA_FIELDS)
    const [isSubmitting, setIsSubmitting] = useState<AuthInputSubmitting>(DEFAULT_AUTH_INPUT_SUBMITTING)
    const [error, setError] = useState<AuthFormDataError>(DEFAULT_AUTH_FORM_DATA_ERROR);

    function setLoginFormError(field: AuthFormDataError) {
        setError((prev) => { return { ...prev, ...field } })
    }

    async function submitUserCredentials(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsSubmitting({ form: true });
        setLoginFormError(DEFAULT_AUTH_FORM_DATA_ERROR);
        const form = event.target as AuthFormDataTarget;
        const username = form.username.value;
        const email = form.email.value;
        const password = form.password.value;
        const newErrors: AuthFormDataError = {
            username: !username,
            email: !email,
            password: !password,
        };
        setLoginFormError(newErrors);

        const hasErrors = Object.values(newErrors).some(
            (error) => error === true
        );

        //Successful Submit Logic
        if (!hasErrors) {
            try {
                const user = await login({
                    username,
                    email,
                    password
                })

                if (user) {
                    router.push("/movie")
                }
            } catch (e) {
                console.error(e)
                toast({
                    variant: "destructive",
                    title: "Something is wrong.",
                    description: "There was a problem with your request.",
                })
            }
        }

        setIsSubmitting({ form: false });
    }

    return (
        <div className="h-full w-full flex items-center flex-grow justify-center bg-black">
            <form onSubmit={submitUserCredentials}>
                <div className="border border-gray-200 rounded-md p-6 flex flex-col gap-5 min-w-96 bg-white">
                    <p className="text-4xl font-semibold">
                        Login
                    </p>
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-col">
                            <label className="text-lg">
                                Username
                            </label>
                            <input name="username" type="text" value={formsInput.username} onChange={(e) => { handleUsernameOnChange(e, setFormsInput, setLoginFormError) }} placeholder="Username" className="border border-gray-200 rounded-sm text-md font-light p-1" disabled={isSubmitting.form} />
                            {error.username && <RequiredFieldError />}
                        </div>
                        <div className="flex flex-col">
                            <label className="text-lg">
                                Email
                            </label>
                            <input name="email" type="email" value={formsInput.email} onChange={(e) => { handleEmailOnChange(e, setFormsInput, setLoginFormError) }} placeholder="Email" className="border border-gray-200 rounded-sm text-md font-light p-1" disabled={isSubmitting.form} />
                            {error.email && <RequiredFieldError />}
                        </div>
                        <div className="flex flex-col">
                            <label className="text-lg">
                                Password
                            </label>
                            <input name="password" type="password" value={formsInput.password} onChange={(e) => { handlepasswordOnChange(e, setFormsInput, setLoginFormError) }} placeholder="Password" className="border border-gray-200 rounded-sm text-md font-light p-1" disabled={isSubmitting.form} />
                            {error.password && <RequiredFieldError />}
                        </div>
                        <div className="flex gap-2">
                            <div> Don&apos;t have an account? </div> <div onMouseDown={() => router.push("/signup")} className="cursor-pointer text-blue-400">Sign up here</div>
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <button type="submit" className="border-gray-200 border rounded-sm text-lg px-6 py-1" disabled={isSubmitting.form}>
                            Submit
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
