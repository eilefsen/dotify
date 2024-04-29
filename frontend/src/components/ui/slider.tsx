"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

const Slider = React.forwardRef<
	React.ElementRef<typeof SliderPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
	<SliderPrimitive.Root
		ref={ref}
		className={cn(
			"relative flex w-full touch-none select-none items-center",
			className,
		)}
		{...props}
	>
		<SliderPrimitive.Track className="slider-track h-1.5 w-full grow cursor-pointer overflow-hidden rounded-full bg-neutral-800 after:absolute after:-top-5">
			<SliderPrimitive.Range className=" absolute h-1.5 rounded-full bg-white" />
		</SliderPrimitive.Track>
		<SliderPrimitive.Thumb className="slider-thumb ring-offset-background focus-visible:ring-ring block h-4 w-4 cursor-grab rounded-full border-2 border-white bg-neutral-900 transition-colors duration-75 hover:bg-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:cursor-grabbing disabled:pointer-events-none disabled:opacity-50" />
	</SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
