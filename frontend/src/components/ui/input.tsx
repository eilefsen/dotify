import * as React from "react";
import { Label } from "@/components/ui/label";

import { cn } from "@/lib/utils";

export interface InputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, type, ...props }, ref) => {
		return (
			<input
				type={type}
				className={cn(
					"border-input focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-300 focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50",
					className,
				)}
				ref={ref}
				{...props}
			/>
		);
	},
);
Input.displayName = "Input";

export interface InputFileProps
	extends React.InputHTMLAttributes<HTMLInputElement> {}

function InputFile(props: InputFileProps) {
	return (
		<div className="grid w-full items-center gap-1.5">
			<Label htmlFor="files">{props.name}</Label>
			<Input id="files" type="file" {...props} />
		</div>
	);
}

export { Input, InputFile };
