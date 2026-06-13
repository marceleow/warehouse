"use client";

import { ArchiveIcon, Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menus = [
  {
    href: "/",
    label: "Home",
    icon: Home,
  },
  {
    href: "/master-data",
    label: "Master Data",
    icon: ArchiveIcon,
  },
];

export default function Dock() {
  const pathname = usePathname();

  const showDock = menus.some((menu) => pathname === menu.href);

  if (!showDock) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card">
      <div className="h-16 flex justify-between px-20">
        {menus.map((menu) => {
          const Icon = menu.icon;
          const active = pathname === menu.href;

          return (
            <Link
              key={menu.href}
              href={menu.href}
              className={`flex flex-col items-center justify-center gap-1 text-xs ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon size={20} />
              <span>{menu.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
