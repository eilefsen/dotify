import { RegisterForm } from "@/components/registerForm";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/register")({
	component: Register,
});

function Register() {
	return <RegisterForm />;
}
