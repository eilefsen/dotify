import { LogInIcon } from "lucide-react";
import { Button } from "./ui/button";
import {
	Drawer,
	DrawerHeader,
	DrawerContent,
	DrawerTrigger,
	DrawerTitle,
} from "./ui/drawer";
import { LoginForm } from "./loginForm";
import { useState } from "react";

export function LoginDialog() {
	const [open, setOpen] = useState(false);

	return (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>
				<Button variant="foreground" type="submit" className="flex">
					<LogInIcon />
				</Button>
			</DrawerTrigger>
			<DrawerContent className="bg-background">
				<DrawerHeader>
					<DrawerTitle>Login</DrawerTitle>
				</DrawerHeader>
				<LoginForm
					showTitle={false}
					onSuccess={() => {
						setOpen(false);
					}}
				/>
			</DrawerContent>
		</Drawer>
	);
}
