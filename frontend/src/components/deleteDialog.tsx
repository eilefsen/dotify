import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { MouseEventHandler } from "react";
import { Trash2Icon } from "lucide-react";

interface DeleteDialogProps {
	kind: string;
	name: string;
	onClick: MouseEventHandler;
}

export function DeleteDialog(props: DeleteDialogProps) {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="destructiveHover" type="submit" className="flex">
					<Trash2Icon />
				</Button>
			</DialogTrigger>
			<DialogContent className="bg-background sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Delete {props.kind}</DialogTitle>
					<DialogDescription>
						Are you sure you want to delete <em>"{props.name}"</em>
					</DialogDescription>
				</DialogHeader>
				<div className="flex items-center space-x-2">
					<Button
						type="submit"
						onClick={props.onClick}
						className="flex"
						variant="destructiveHover"
					>
						<Trash2Icon />
					</Button>
					<DialogClose asChild>
						<Button type="submit" className="flex" variant="outline">
							No
						</Button>
					</DialogClose>
				</div>
			</DialogContent>
		</Dialog>
	);
}
