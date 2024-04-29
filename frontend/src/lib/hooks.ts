import React from "react";

export const useIsOverflow = (
	ref: React.RefObject<HTMLElement>,
	callback: React.RefCallback<boolean>,
) => {
	const [isOverflow, setIsOverflow] = React.useState(false);

	React.useLayoutEffect(() => {
		const { current } = ref;

		if (current == null) {
			return;
		}

		const trigger = () => {
			const hasOverflow = current.scrollHeight > current.clientHeight;

			setIsOverflow(hasOverflow);

			if (callback) callback(hasOverflow);
		};

		if (current) {
			trigger();
		}
	}, [callback, ref]);

	return isOverflow;
};
