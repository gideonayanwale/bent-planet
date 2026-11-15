import type { Metadata } from "next";
import DemoPage from "./demo-page";
export const metadata: Metadata = { title: "Interactive Product Demo | Gatherwell", description: "Explore the church conference, audience and communications platform." };
export default function Page() { return <DemoPage />; }
