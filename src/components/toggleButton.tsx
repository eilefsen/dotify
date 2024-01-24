import { IconContext } from "react-icons";

interface ToggleButtonProps {
    onClick: React.MouseEventHandler;
    toggleState: boolean;
    isDisabled?: boolean;
    iconOn: React.ReactNode;
    iconOff: React.ReactNode;
    iconSize?: number
    className?: string
}

export default function ToggleButton(props: ToggleButtonProps) {
    const { onClick, toggleState, isDisabled, iconOn, iconOff, iconSize = 8, className } = props
    return (
        <button
            className={"align-middle " + className}
            disabled={isDisabled}
            onClick={onClick}
            aria-label={toggleState ? "on" : "off"}
        >
            <IconContext.Provider value={{ className: 'align-middle size-' + iconSize }}>
                {toggleState ? iconOn : iconOff}
            </IconContext.Provider>
        </button>
    )

}