import { ChangeEvent, Dispatch, SetStateAction } from 'react';

type InputChangeEvent = ChangeEvent<HTMLInputElement | HTMLSelectElement>;

export const changeInput = <T>(
    e: InputChangeEvent,
    setState: Dispatch<SetStateAction<T>>,
    setErrors: Dispatch<SetStateAction<{ [key in keyof T]?: boolean }>>
) => {
    const { name, value } = e.target;
    setState(prevState => ({
        ...prevState,
        [name]: value
    }));
    setErrors(prevErrors => ({
        ...prevErrors,
        [name]: false
    }));
};