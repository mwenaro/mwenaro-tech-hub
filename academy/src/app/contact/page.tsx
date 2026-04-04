import type { Metadata } from "next";
import ContactClient from "./contact-client";

export const metadata: Metadata = {
    title: "Contact Us | Mwenaro Academy - Support & Enrollment",
    description: "Get in touch with Mwenaro Academy. Reach out for support, course inquiries, or to book a discovery call with our team to start your tech journey.",
    alternates: {
        canonical: "/contact",
    },
};

export default function ContactPage() {
    return <ContactClient />;
}
