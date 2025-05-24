import { ChangeEvent } from "react";
import { AuthFormDataError, AuthFormDataFields } from "../types/authForms";

export function handleUsernameOnChange(
    event: ChangeEvent<HTMLInputElement>,
    setValue: React.Dispatch<React.SetStateAction<AuthFormDataFields>>,
    setError: (field: AuthFormDataError) => void
){
    setValue((prev)=>({...prev, username: (event.target.value).split(' ').join('')}))
    setError({username: false})
}

export function handleEmailOnChange(
    event: ChangeEvent<HTMLInputElement>,
    setValue: React.Dispatch<React.SetStateAction<AuthFormDataFields>>,
    setError: (field: AuthFormDataError) => void
){
    setValue((prev)=>({...prev, email: (event.target.value).split(' ').join('')}))
    setError({email: false})
}

export function handlepasswordOnChange(
    event: ChangeEvent<HTMLInputElement>,
    setValue: React.Dispatch<React.SetStateAction<AuthFormDataFields>>,
    setError: (field: AuthFormDataError) => void
){
    setValue((prev)=>({...prev, password: event.target.value}))
    setError({password: false})
}