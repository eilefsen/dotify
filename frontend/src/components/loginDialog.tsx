import { LogInIcon } from "lucide-react";
import { Button } from "./ui/button";
import {
	Drawer,
	DrawerHeader,
	DrawerContent,
	DrawerTrigger,
	DrawerTitle,
} from "./ui/drawer";
import { LoginRegisterForm } from "./loginForm";
import { useState } from "react";

interface LoginDialogProps {
	open?: boolean;
	showTrigger?: boolean;
}

export function LoginDialog(props: LoginDialogProps) {
	const [open, setOpen] = useState(!!props.open);

	const registerOpenedState = useState(false);
	const [registerOpened, _] = registerOpenedState;

	function onSuccess() {
		if (props.open != undefined) {
			setOpen(false);
		} else {
		}
	}

	return (
		<Drawer open={open} onOpenChange={setOpen}>
			{props.showTrigger && (
				<DrawerTrigger asChild>
					<Button variant="foreground" type="submit" className="flex">
						<LogInIcon />
					</Button>
				</DrawerTrigger>
			)}
			<DrawerContent className="bg-background">
				<DrawerHeader>
					<DrawerTitle>{registerOpened ? "Register" : "Login"}</DrawerTitle>
				</DrawerHeader>
				<LoginRegisterForm
					showTitle={false}
					onSuccess={onSuccess}
					registerOpenedState={registerOpenedState}
				/>
			</DrawerContent>
		</Drawer>
	);
}
