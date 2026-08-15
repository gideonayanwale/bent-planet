"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOutAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { BrandIcon } from "@/components/brand-logo";
import {
  CalendarIcon,
  HomeIcon,
  MailIcon,
  UsersIcon,
  LogOutIcon,
  GlobeIcon,
  SparklesIcon,
  HardDriveIcon,
} from "lucide-react";

interface DashboardNavProps {
  churchName?: string;
  churchLogo?: string | null;
  adminEmail?: string;
  isSuperAdmin?: boolean;
}

export function DashboardNav({
  churchName,
  churchLogo,
  adminEmail,
  isSuperAdmin = false,
}: DashboardNavProps) {
  const pathname = usePathname();

  const churchNavItems = [
    { label: "Dashboard", href: "/dashboard", icon: HomeIcon },
    { label: "Conferences", href: "/dashboard/conferences", icon: CalendarIcon },
    { label: "Subscribers", href: "/dashboard/subscribers", icon: UsersIcon },
    { label: "Email Center", href: "/dashboard/emails", icon: MailIcon },
  ];

  const superAdminNavItems = [
    { label: "Overview", href: "/super-admin", icon: HomeIcon },
    { label: "Invite Church", href: "/super-admin/invite", icon: SparklesIcon },
    { label: "Cloud Storage", href: "/super-admin/storage", icon: HardDriveIcon },
  ];

  const items = isSuperAdmin ? superAdminNavItems : churchNavItems;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-8">
        <div className="flex items-center gap-6">
          <Link href={isSuperAdmin ? "/super-admin" : "/dashboard"} className="flex items-center gap-3">
            {churchLogo ? (
              <img src={churchLogo} alt={churchName} className="h-8 w-8 rounded-lg object-cover" />
            ) : (
              <BrandIcon size={34} className="shrink-0" />
            )}
            <div className="flex flex-col">
              <span className="font-heading text-lg font-bold tracking-tight text-foreground leading-none">
                {isSuperAdmin ? "Bent Planet Admin" : churchName || "Bent Planet"}
              </span>
              <span className="text-[11px] text-muted-foreground font-medium leading-none mt-1">
                {isSuperAdmin ? adminEmail || "Super Admin Portal" : "Church Dashboard"}
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {items.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/dashboard" && item.href !== "/super-admin" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-secondary text-primary"
                      : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          
          {!isSuperAdmin && (
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex text-muted-foreground">
              <Link href="/" target="_blank" className="flex items-center gap-1.5">
                <GlobeIcon className="h-3.5 w-3.5" />
                Public Site
              </Link>
            </Button>
          )}

          <form action={signOutAction}>
            <Button variant="outline" size="sm" type="submit" className="flex items-center gap-1.5">
              <LogOutIcon className="h-3.5 w-3.5" />
              Sign out
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
