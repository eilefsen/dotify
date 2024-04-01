import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Upload } from "./upload";
import { useNavigate } from "react-router-dom";

export default function Admin() {
	const result = useQuery({
		queryKey: ["adminLoginStatus"],
		queryFn: async () => {
			const res = await axios.post(`/api/auth/adminstatus`, {
				validateStatus: () => true,
			});
			const ok = res.status == 200;
			if (ok) {
				console.info("Your access token is valid!");
			}
			return ok;
		},
		initialData: false,
		retry: false,
	});

	const navigate = useNavigate();
	if (!result.data) {
		navigate("/login");
	}
	return <>{result.data && <Upload />}</>;
}
