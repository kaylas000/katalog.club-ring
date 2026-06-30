import { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Контакты",
  description: "Свяжитесь с нами по любым вопросам.",
};

export default function ContactPage() {
  return <ContactClient />;
}
