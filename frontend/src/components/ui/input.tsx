import * as React from "react";

import {cn} from "@/lib/utils";

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({className, type, ...props}, ref) => {
        return (
            <input
                type={type}
                className={cn(
                    "block h-16 rounded-xl text-black bg-white hover:bg-neutral-200 active:bg-neutral-300 text-sm transition-colors file:border-0 file:bg-transparent file:w-full file:h-full file:text-lg file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
Input.displayName = "Input";

export {Input};
