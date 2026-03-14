import type { Metadata } from "next";
import ContactClient from "./contact-client";

export const metadata: Metadata = {
    title: "Contact Us",
    description: "Get in touch with Mwenaro Academy. Reach out for support, course inquiries, or to book a discovery call with our team.",
};

export default function ContactPage() {
    return <ContactClient />;
}
