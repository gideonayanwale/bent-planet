"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOutAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { BrandIcon } from "@/components/brand-logo";
import { NotificationBell } from "@/components/notification-bell";
import {
  CalendarIcon,
  HomeIcon,
  MailIcon,
  UsersIcon,
  LogOutIcon,
  GlobeIcon,
  SparklesIcon,
  HardDriveIcon,
  SettingsIcon,
  MenuIcon,
  XIcon,
} from "lucide-react";

interface DashboardNavProps {
  churchName?: string;
  churchLogo?: string | null;
  adminEmail?: string;
  churchId?: string;
  isSuperAdmin?: boolean;
}

export function DashboardNav({
  churchName,
  churchLogo,
  adminEmail,
  churchId,
  isSuperAdmin = false,
}: DashboardNavProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const churchNavItems = [
    { label: "Dashboard", href: "/dashboard", icon: HomeIcon },
    { label: "Conferences", href: "/dashboard/conferences", icon: CalendarIcon },
    { label: "Templates", href: "/templates", icon: SparklesIcon },
    { label: "Subscribers", href: "/dashboard/subscribers", icon: UsersIcon },
    { label: "Email Center", href: "/dashboard/emails", icon: MailIcon },
    { label: "Settings", href: "/dashboard/settings", icon: SettingsIcon },
  ];

  const superAdminNavItems = [
    { label: "Overview", href: "/super-admin", icon: HomeIcon },
    { label: "Invite Church", href: "/super-admin/invite", icon: SparklesIcon },
    { label: "Cloud Storage", href: "/super-admin/storage", icon: HardDriveIcon },
    { label: "Settings", href: "/super-admin/settings", icon: SettingsIcon },
  ];

  const items = isSuperAdmin ? superAdminNavItems : churchNavItems;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/85 backdrop-blur-md transition-colors">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-8">
        <div className="flex items-center gap-6">
          <Link href={isSuperAdmin ? "/super-admin" : "/dashboard"} className="flex items-center gap-3">
            {churchLogo ? (
              <img src={churchLogo} alt={churchName} className="h-8 w-8 rounded-lg object-cover border border-border" />
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
              const isActive = pathname === item.href || (item.href !== "/dashboard" && item.href !== "/super-admin" && (pathname?.startsWith(item.href) ?? false));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-primary/10 text-primary border border-primary/20 dark:bg-primary/20"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <NotificationBell churchId={churchId} />
          
          {!isSuperAdmin && (
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex text-muted-foreground text-xs font-semibold">
              <Link href="/" target="_blank" className="flex items-center gap-1.5">
                <GlobeIcon className="h-3.5 w-3.5" />
                Public Site
              </Link>
            </Button>
          )}

          <form action={signOutAction} className="hidden sm:block">
            <Button variant="outline" size="sm" type="submit" className="flex items-center gap-1.5 text-xs font-semibold">
              <LogOutIcon className="h-3.5 w-3.5" />
              Sign out
            </Button>
          </form>

          {/* Mobile Menu Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-muted-foreground"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-background/95 backdrop-blur-md px-4 py-4 space-y-2 animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-2 gap-2">
            {items.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/dashboard" && item.href !== "/super-admin" && (pathname?.startsWith(item.href) ?? false));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 rounded-xl p-3 text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-border flex items-center justify-between">
            {!isSuperAdmin && (
              <Button asChild variant="ghost" size="sm" className="text-xs">
                <Link href="/" target="_blank" className="flex items-center gap-1.5">
                  <GlobeIcon className="h-3.5 w-3.5" />
                  Public Site
                </Link>
              </Button>
            )}
            <form action={signOutAction} className="w-full sm:w-auto">
              <Button variant="outline" size="sm" type="submit" className="w-full flex items-center justify-center gap-1.5 text-xs text-destructive hover:bg-destructive/10">
                <LogOutIcon className="h-3.5 w-3.5" />
                Sign out
              </Button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}

