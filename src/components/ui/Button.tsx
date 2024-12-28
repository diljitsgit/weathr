type buttonType = {
    onClick: () => void;
    children: string;
};

export default function Button({ onClick, children }: buttonType) {
    return (
        <button
            onClick={onClick}
            className="px-3 py-1 bg-transparent text-black dark:text-white rounded-md border-[1px] border-outline lg:rounded-xl md:rounded-lg focus:outline-none"
        >
            {children}
        </button>
    );
}
