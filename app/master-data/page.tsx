import { PackageIcon } from "lucide-react";
import Link from "next/link";

const LINKS = [
  {
    label: "Materials",
    icon: PackageIcon,
    href: "/master-data/materials",
    description: "Manage your warehouse materials",
  },
];

export default function Page() {
  return (
    <div className="px-4 py-10 space-y-6">
      <h1 className="text-3xl font-bold">Master Data</h1>
      <div className="space-y-4">
        {LINKS.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="flex items-center space-x-4 bg-card p-4 rounded-lg"
          >
            <div className="p-2 rounded-lg bg-secondary">
              <link.icon className="size-6" />
            </div>
            <div className="space-y-2">
              <span className="font-semibold">{link.label}</span>
              <p className="text-xs text-muted-foreground">{link.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
