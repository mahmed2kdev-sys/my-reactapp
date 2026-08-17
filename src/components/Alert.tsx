import { type ReactNode } from "react";

interface Props {
    color?: 'red' | 'blue' | 'green' | 'orange';
    onClose?: () => void;
    children: ReactNode;
}

function Alert({ color = 'blue', onClose, children }: Props) {
    const colorClasses = {
        red: 'bg-red-400',
        blue: 'bg-blue-400',
        green: 'bg-green-400',
        orange: 'bg-orange-400',
    };

    return (
        <div role="alert" className={`mt-3 relative flex w-full p-3 rounded-md text-white ${colorClasses[color]}`}>
            {children}
            <button className="flex items-center justify-center transition-all w-8 h-8 rounded-md text-white hover:bg-white/10 active:bg-white/10 absolute top-1.5 right-1.5" type="button" aria-label="Close alert" onClick={onClose}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-5 w-5" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
        </div>
    )
}

export default Alert;