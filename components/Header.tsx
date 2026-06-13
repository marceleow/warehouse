import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "./ui/button";

interface HeaderProps {
  label: string;
}

export default function Header({ label }: HeaderProps) {
  return (
    <header className="z-50 border-b bg-card">
      <div className="p-4">
        <div className="flex gap-2 items-center">
          <Link className={buttonVariants({ variant: "link", size: "icon" })} href="/master-data">
            <ChevronLeftIcon className="size-6" />
          </Link>
          <h1 className="text-xl font-bold">{label}</h1>
        </div>
      </div>
    </header>
  );
}
