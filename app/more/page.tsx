import { PackageIcon, WrenchIcon } from "lucide-react";
import Link from "next/link";

const LINKS = [
  {
    label: "Materials",
    icon: PackageIcon,
    href: "/more/materials",
    description: "Manage your warehouse materials",
  },
  {
    label: "Stock Adjustments",
    icon: WrenchIcon,
    href: "/more/adjustments",
    description: "Create and view stock adjustments",
  },
];

export default function Page() {
  return (
    <div className="px-4 py-10 space-y-6">
      <h1 className="text-3xl font-bold">More</h1>
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
