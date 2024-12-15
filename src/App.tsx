"use client";

import { useState } from "react";
import Weather from "./Weather";

//APP Component
function App() {
    const [theme, setTheme] = useState("dark");

    function changeTheme() {
        if (theme == "dark") {
            setTheme("light");
        } else {
            setTheme("dark");
        }
    }

    return (
        <>
            <div className={theme}>
                <div className="bg-lbackground dark:bg-dbackground w-screen h-screen overflow-y-scroll overflow-x-hidden">
                    <Navbar changeThemeDrill={changeTheme}></Navbar>
                    <div className="flex w-screen justify-between items-center px-4 py-4 md:px-16 lg:px-96 lg:py-20">
                        <Section>
                            <Weather></Weather>
                        </Section>
                    </div>
                </div>
            </div>
        </>
    );
}

function Navbar({ changeThemeDrill }: { changeThemeDrill: () => void }) {
    return (
        <>
            <div className="block w-screen h-[50px] bg-background px-10 border-b-[1px] border-outline">
                <div className="flex justify-between items-center h-[50px]">
                    <h1 className="text-black dark:text-white font-logo font-extrabold text-2xl">
                        WEATHR
                    </h1>
                    <div className="flex gap-3 justify-between items-center">
                        <Toggle click={changeThemeDrill}></Toggle>
                        <img
                            src="/src/assets/github-mark-white.svg"
                            alt="Github Icon"
                            className="size-5 invert dark:invert-0"
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

function Toggle({ click }: { click: () => void }) {
    return (
        <>
            <>
                <button
                    type="button"
                    className="hidden font-medium rounded-full text-slate-50 hover:bg-primary transition ease-in-out duration-500 dark:block"
                    onClick={click}
                >
                    <span className="group inline-flex shrink-0 justify-center items-center size-9">
                        <svg
                            className="shrink-0 size-5"
                            xmlns="http://www.w3.org/2000/svg"
                            width={24}
                            height={24}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                        </svg>
                    </span>
                </button>
                <button
                    type="button"
                    className="block dark:hidden font-medium rounded-full text-slate-50 hover:bg-primary transition ease-in-out duration-500"
                    onClick={click}
                >
                    <span className="group inline-flex shrink-0 justify-center items-center size-9 invert">
                        <svg
                            className="shrink-0 size-5"
                            xmlns="http://www.w3.org/2000/svg"
                            width={24}
                            height={24}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx={12} cy={12} r={4} />
                            <path d="M12 2v2" />
                            <path d="M12 20v2" />
                            <path d="m4.93 4.93 1.41 1.41" />
                            <path d="m17.66 17.66 1.41 1.41" />
                            <path d="M2 12h2" />
                            <path d="M20 12h2" />
                            <path d="m6.34 17.66-1.41 1.41" />
                            <path d="m19.07 4.93-1.41 1.41" />
                        </svg>
                    </span>
                </button>
            </>
        </>
    );
}

function Section({ children }: { children: JSX.Element }) {
    return (
        <div className="px-4 py-4 overflow-hidden lg:px-20 lg:py-10 bg-background border-[1px] border-outline rounded-xl lg:rounded-3xl md:rounded-2xl flex-1 text-white flex flex-col justify-between">
            {children}
        </div>
    );
}
export default App;
