import { ChangeEvent } from "react";
import { MovieFormDataError, MovieFormDataFields } from "../types/movieForms";

export function handleTitleOnChange(
    event: ChangeEvent<HTMLInputElement>,
    setValue: React.Dispatch<React.SetStateAction<MovieFormDataFields>>,
    setError: (field: MovieFormDataError) => void
){
    setValue((prev)=>({...prev, "title": event.target.value}))
    setError({"title": false})
}

export function handleDescriptionOnChange(
    event: ChangeEvent<HTMLTextAreaElement>,
    setValue: React.Dispatch<React.SetStateAction<MovieFormDataFields>>,
    setError: (field: MovieFormDataError) => void
){
    setValue((prev)=>({...prev, "description": event.target.value}))
    setError({"description": false})
}

export function handleFileOnChange(
    event: ChangeEvent<HTMLInputElement>,
    setValue: React.Dispatch<React.SetStateAction<MovieFormDataFields>>,
    setError: (field: MovieFormDataError) => void
){
    setValue((prev)=>({...prev, "original_file": event.target.value}))
    setError({"original_file": false})
}

