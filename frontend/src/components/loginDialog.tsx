import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogTitle,
	DialogClose,
} from "@/components/ui/dialog";
import { LogInIcon } from "lucide-react";
import { Button } from "./ui/button";
import { DialogHeader } from "./ui/dialog";
import { LoginForm } from "./loginForm";

export function LoginDialog() {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="foreground" type="submit" className="flex">
					<LogInIcon />
				</Button>
			</DialogTrigger>
			<DialogContent className="bg-background sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Login</DialogTitle>
				</DialogHeader>
				<LoginForm />
			</DialogContent>
		</Dialog>
	);
}
