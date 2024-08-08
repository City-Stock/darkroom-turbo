import Dashboard from "@/components/Dashboard";
import { Metadata } from "next";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Mr. Leads Needs",
  description: "This is Home for TailAdmin",
  // other metadata
};

export default async function Home() {
  return <Dashboard />;
}
