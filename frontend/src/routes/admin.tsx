import { Link, Outlet, createFileRoute } from "@tanstack/react-router";
import axios from "axios";
import { LoginForm } from "./login";
import { useQuery } from "@tanstack/react-query";

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
			<div className="flex justify-start">
				<Link
					className="rounded px-2 py-1"
					inactiveProps={{ className: "bg-neutral-700 text-white" }}
					activeProps={{ className: "bg-white text-black" }}
					to="/admin/upload"
				>
					Upload Music
				</Link>
				<Link
					className="rounded px-2 py-1"
					inactiveProps={{ className: "bg-neutral-700 text-white" }}
					activeProps={{ className: "bg-white text-black" }}
					to="/admin/artists"
				>
					Edit Artists
				</Link>
				<Link
					className="rounded px-2 py-1"
					inactiveProps={{ className: "bg-neutral-700 text-white" }}
					activeProps={{ className: "bg-white text-black" }}
					to="/admin/albums"
				>
					Edit Albums
				</Link>
			</div>
			<div className="pt-1">{outlet}</div>
		</div>
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
