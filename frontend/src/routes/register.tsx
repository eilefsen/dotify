import { LoginRegisterForm } from "@/components/loginForm";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/register")({
	component: Register,
});

function Register() {
	return <LoginRegisterForm defaultAsRegister />;
}
