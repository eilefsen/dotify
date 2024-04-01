import { useNavigate } from "react-router-dom";
import { LoginForm } from "./form";

export default function Login() {
	const navigate = useNavigate();
	function onSuccess() {
		navigate(-1);
	}
	return (
		<>
			<LoginForm onSuccess={onSuccess} />
		</>
	);
}
