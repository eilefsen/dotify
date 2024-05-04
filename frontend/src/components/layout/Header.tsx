import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Button } from "../ui/button";
import { FileSlidersIcon, LogOutIcon } from "lucide-react";
import axios from "axios";
import { LoginDialog } from "../loginDialog";

export function Header() {
	const login = useQuery({
		queryKey: ["loginStatus"],
		initialData: false,
		retry: false,
		enabled: false,
	});
	const admin = useQuery({
		queryKey: ["adminLoginStatus"],
		initialData: false,
		retry: false,
		enabled: false,
	});

	const queryclient = useQueryClient();

	const logoutMut = useMutation({
		mutationKey: ["logout"],
		mutationFn: async () => {
			const res = await axios.post("/api/auth/logout");
			return res.data;
		},
		onSuccess: () => {
			queryclient.setQueryData(["loginStatus"], false);
			queryclient.setQueryData(["adminLoginStatus"], false);
		},
	});

	return (
		<div className="fixed left-0 right-0 top-0 z-20 flex h-14 items-center justify-between gap-2 overflow-hidden border-b border-border bg-hover px-2 pt-1">
			<div className="flex items-center font-bold">
				<img src="/images/logo.png" alt="Dotify logo" className="h-12" />
				Dotify
			</div>
			<div className="flex gap-2">
				{login.data ? (
					<Button variant="outline" onClick={() => logoutMut.mutate()}>
						<LogOutIcon />
					</Button>
				) : (
					<LoginDialog showTrigger />
				)}
				{admin.data && (
					<Link to="/admin/upload">
						<Button>
							<FileSlidersIcon />
						</Button>
					</Link>
				)}
			</div>
		</div>
	);
}
