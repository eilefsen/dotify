import { LoginRegisterForm } from "@/components/loginForm";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
	component: LoginRegisterForm,
});
