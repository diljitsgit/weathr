import { ChangeEvent } from "react";

type inputType = {
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    placeHolder: string;
};

export default function Input({ value, onChange, placeHolder }: inputType) {
    return (
        <input
            className="px-3 py-1 bg-transparent text-black dark:text-white rounded-md border-[1px] border-outline lg:rounded-xl md:rounded-lg focus:outline-none"
            type="text"
            value={value}
            onChange={onChange}
            placeholder={placeHolder}
        />
    );
}
