import { useIsOverflow } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import React, { PropsWithChildren } from "react";

interface OverflowMarqueeProps extends PropsWithChildren {
	className?: string;
}
export function OverflowMarquee(props: OverflowMarqueeProps) {
	const ref = React.useRef<HTMLDivElement>(null);

	const isOverflow = useIsOverflow(ref, [props.children]);

	console.debug("isOverflow", isOverflow);

	let marqueeCN = "";
	if (isOverflow) {
		marqueeCN = "animate-marquee pr-12 w-fit";
	}

	return (
		<div className={cn("min-w-0 overflow-x-hidden", props.className)}>
			<div className="relative w-full whitespace-nowrap">
				<div ref={ref}>
					<div className={marqueeCN}>{props.children}</div>
				</div>
				{isOverflow && (
					<div className="absolute top-0 w-fit animate-marquee2 pr-12">
						{props.children}
					</div>
				)}
			</div>
		</div>
	);
}
