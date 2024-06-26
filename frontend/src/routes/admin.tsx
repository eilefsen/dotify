import { Link, Outlet, createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { LoginDialog } from "@/components/loginDialog";

export const Route = createFileRoute("/admin")({
	component: Admin,
});

function Admin() {
	const admin = useQuery({
		queryKey: ["adminLoginStatus"],
		initialData: false,
		retry: false,
		enabled: false,
	});

	return (
		<>
			{admin.data && (
				<div className="mx-auto max-w-md px-1 pt-4">
					<div className="flex w-full justify-stretch gap-2">
						<AdminLink to="/admin/upload">Upload Music</AdminLink>
						<AdminLink to="/admin/artists">Edit Artists</AdminLink>
						<AdminLink to="/admin/albums">Edit Albums</AdminLink>
					</div>
					<div className="pt-2">
						<Outlet />
					</div>
				</div>
			)}
			<LoginDialog showTrigger={false} open={!admin.data} />
		</>
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
