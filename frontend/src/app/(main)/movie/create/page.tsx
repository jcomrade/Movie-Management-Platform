"use client";

import { RequiredFieldError } from "@/components/group/error";
import { useToast } from "@/hooks/use-toast";
import { DEFAULT_MOVIE_FORM_DATA_ERROR, DEFAULT_MOVIE_FORM_DATA_FIELDS, DEFAULT_MOVIE_INPUT_SUBMITTING } from "@/lib/constants/movieForms";
import { useFetch } from "@/lib/hooks/useFetch";
import { MovieFormDataError, MovieFormDataFields, MovieFormDataTarget, MovieInputSubmitting } from "@/lib/types/movieForms";
import { handleDescriptionOnChange, handleFileOnChange, handleTitleOnChange } from "@/lib/utils/movieForms";
import { FormEvent, useState } from "react";

export default function MovieCreate() {
    const { apiAuthPost } = useFetch()
    const { toast } = useToast()
    const [formsInput, setFormsInput] = useState<MovieFormDataFields>(DEFAULT_MOVIE_FORM_DATA_FIELDS)
    const [isSubmitting, setIsSubmitting] = useState<MovieInputSubmitting>(DEFAULT_MOVIE_INPUT_SUBMITTING)
    const [error, setError] = useState<MovieFormDataError>(DEFAULT_MOVIE_FORM_DATA_ERROR);

    function setMovieFormError(field: MovieFormDataError) {
        setError((prev) => { return { ...prev, ...field } })
    }

    async function handleMovieSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsSubmitting({ form: true });
        setMovieFormError(DEFAULT_MOVIE_FORM_DATA_ERROR);
        const form = event.target as MovieFormDataTarget;
        const original_file = (form.original_file as HTMLInputElement).files?.[0];
        const title = form.title.value;
        const description = form.description.value;
        const newErrors: MovieFormDataError = {
            original_file: !original_file,
            title: !title,
            description: !description,
        };
        setMovieFormError(newErrors);
        const hasErrors = Object.values(newErrors).some(
            (error) => error === true
        );

        if (!hasErrors && original_file) {
            try {
                const formData = new FormData();
                formData.append('original_file', original_file);
                formData.append('title', title);
                formData.append('description', description);
                const result = await apiAuthPost("api/movie", formData)
                toast({
                    title: "Success!",
                    description: `Your movie ${result?.movieList?.title} has been created.`,
                })
                setFormsInput(DEFAULT_MOVIE_FORM_DATA_FIELDS)
            } catch (e) {
                console.error(e)
                toast({
                    variant: "destructive",
                    title: "Uh oh! Something went wrong.",
                    description: "There was a problem with your request.",
                })
            }
        }

        setIsSubmitting({ form: false });
    }

    return (
        <div className="h-full w-full">
            <div className="w-full flex justify-center text-white">
                <form onSubmit={handleMovieSubmit} className="flex flex-col gap-8 w-4/6">
                    <div className="flex flex-col gap-2">
                        <div className="text-center font-semibold text-6xl">
                            Create A Movie
                        </div>
                        <div className="text-center font-thin text-lg">
                            Submit your favorite film and let others discover what makes it special to you.
                        </div>
                    </div>
                    <div className="flex flex-col gap-y-2">
                        <label className="font-semibold text-2xl">Select Movie (.mp4)</label>
                        <input name="original_file" onChange={(e) => handleFileOnChange(e, setFormsInput, setMovieFormError)} value={formsInput.original_file} type="file" className="w-full text-center" disabled={isSubmitting.form} />
                        {error.original_file && <RequiredFieldError />}
                    </div>
                    <div className="flex flex-col gap-y-2">
                        <label className="font-semibold text-2xl">Movie Title</label>
                        <input name="title" onChange={(e) => handleTitleOnChange(e, setFormsInput, setMovieFormError)} value={formsInput.title} type="text" placeholder="Title" className="w-full text-2xl rounded-sm px-2 text-black" disabled={isSubmitting.form} />
                        {error.title && <RequiredFieldError />}
                    </div>
                    <div className="flex flex-col gap-y-2">
                        <label className="font-semibold text-2xl">Movie Description</label>
                        <textarea name="description" onChange={(e) => handleDescriptionOnChange(e, setFormsInput, setMovieFormError)} value={formsInput.description} placeholder="Movie Description" className="w-full h-36 text-2xl rounded-sm px-3 py-2 text-black" disabled={isSubmitting.form} />
                        {error.description && <RequiredFieldError />}
                    </div>

                    <div className="flex justify-end">
                        <button type="submit" className="text-2xl font-semibold px-6 py-2 rounded-lg bg-[#E50914]" disabled={isSubmitting.form}>
                            {isSubmitting.form ? "Creating" : "Create"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
