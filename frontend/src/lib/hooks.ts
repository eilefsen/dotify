import React from "react";

export const useIsOverflow = (
	ref: React.RefObject<HTMLElement>,
	dependencies?: React.DependencyList,
	callback?: React.RefCallback<boolean>,
) => {
	const [isOverflow, setIsOverflow] = React.useState(false);
	let deps: React.DependencyList = [];

	if (dependencies) {
		deps = dependencies;
	}

	React.useLayoutEffect(() => {
		const { current } = ref;
		if (current == null) {
			return;
		}

		const trigger = () => {
			const hasOverflow = current.scrollWidth > current.clientWidth;

			setIsOverflow(hasOverflow);

			if (callback) callback(hasOverflow);
		};

		if (current) {
			trigger();
		}
	}, [callback, ref, ...deps]);

	return isOverflow;
};
