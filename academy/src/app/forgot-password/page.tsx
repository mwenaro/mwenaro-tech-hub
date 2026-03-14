import type { Metadata } from "next";
import ForgotPasswordForm from "./forgot-password-form";

export const metadata: Metadata = {
    title: "Reset Password",
    description: "Forgot your password? Enter your email address to reset it and regain access to Mwenaro Academy.",
};

export default function ForgotPasswordPage() {
    return <ForgotPasswordForm />;
}
