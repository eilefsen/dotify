import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, type, ...props }, ref) => {
		return (
			<input
				type={type}
				className={cn(
					"focus-visible:ring-ring block h-8 rounded-md border border-white bg-black px-3 text-sm text-white transition-colors file:h-full file:w-full file:border-none file:bg-transparent file:text-lg file:font-medium hover:bg-neutral-200 focus-visible:outline-none focus-visible:ring-1 active:bg-neutral-300 disabled:cursor-not-allowed disabled:opacity-50",
					className,
				)}
				ref={ref}
				{...props}
			/>
		);
	},
);
Input.displayName = "Input";

interface InputFileProps extends InputProps {}

function InputFile(props: InputFileProps) {
	const fileRef = React.useRef<HTMLInputElement>(null);
	const [file, setFile] = React.useState<File>(new File([], ""));
	function handleInputChange() {
		if (!fileRef.current) {
			return;
		}
		if (fileRef.current.type != "file") {
			return;
		}
		const file = fileRef.current.files![0];
		setFile(file);
	}

	return (
		<>
			<div className="inline-block  bg-neutral-900 text-center">
				<div className="rounded-md rounded-b-none  border-l border-r border-t border-white p-2 text-neutral-100">
					{file.name || "No File Selected"}
				</div>
				<Input
					ref={fileRef}
					className="rounded-t-none"
					id="audio"
					name="audio"
					type="file"
					accept=".mp3,.aac,.m4a"
					onChange={handleInputChange}
				/>
			</div>
		</>
	);
}

export { Input, InputFile };
