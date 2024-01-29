
interface ToggleButtonProps {
	onClick: React.MouseEventHandler;
	toggleState: boolean;
	isDisabled?: boolean;
	iconOn: React.ReactNode;
	iconOff: React.ReactNode;
	className?: string
}

export default function ToggleButton(props: ToggleButtonProps) {
	const { onClick, toggleState, isDisabled, iconOn, iconOff, className } = props
	return (
		<button
			className={"align-middle " + className}
			disabled={isDisabled}
			onClick={onClick}
			aria-label={toggleState ? "on" : "off"}
		>
			{toggleState ? iconOn : iconOff}
		</button>
	)

}