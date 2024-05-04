import { Link, Outlet, createFileRoute } from "@tanstack/react-router";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { LoginForm } from "@/components/loginForm";

export const Route = createFileRoute("/admin")({
	component: Admin,
});

function Admin() {
	const result = useQuery({
		queryKey: ["adminLoginStatus"],
		queryFn: getAdminLoginStatus,
	});
	let outlet = <Outlet />;
	if (!result.data) {
		outlet = <LoginForm />;
	}

	return (
		<div className="mx-auto max-w-md px-1 pt-4">
			<div className="flex w-full justify-stretch gap-2">
				<AdminLink to="/admin/upload">Upload Music</AdminLink>
				<AdminLink to="/admin/artists">Edit Artists</AdminLink>
				<AdminLink to="/admin/albums">Edit Albums</AdminLink>
			</div>
			<div className="pt-2">{outlet}</div>
		</div>
	);
}

interface AdminLinkProps extends React.PropsWithChildren {
	to: string;
}
function AdminLink(props: AdminLinkProps) {
	return (
		<Link
			className="w-full rounded border px-1 py-1.5 text-center"
			inactiveProps={{
				className: "border-border bg-background text-foreground",
			}}
			activeProps={{
				className: "bg-primary text-primary-foreground border-primary",
			}}
			to={props.to}
		>
			{props.children}
		</Link>
	);
}

export async function getAdminLoginStatus() {
	try {
		await axios.post(`/api/auth/adminstatus`);
	} catch {
		console.log("You are not logged in as admin.");
		return false;
	}
	console.info("Your access token as admin is valid!");
	return true;
}
