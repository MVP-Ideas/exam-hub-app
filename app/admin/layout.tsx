"use client";

import AdminProvider from "@/components/providers/admin-provider";
import AuthenticationProvider from "@/components/providers/auth-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/hooks";
import {
  FileQuestionIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  SettingsIcon,
  Users,
} from "lucide-react";
import Link from "next/link";

const navItems = [
  {
    href: "/admin",
    icon: <LayoutDashboardIcon size={20} className="text-muted" />,
    label: "Dashboard",
  },
  {
    href: "/admin/learner-management",
    icon: <Users size={20} className="text-muted" />,
    label: "Learner Management",
  },
  {
    href: "/admin/question-bank",
    icon: <FileQuestionIcon size={20} className="text-muted" />,
    label: "Question Bank",
  },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const { handleLogout } = useAuth();

  return (
    <AuthenticationProvider>
      <AdminProvider>
        <div className="flex flex-col md:flex-row">
          {/* Desktop Sidebar */}
          <div className="bg-secondary sticky top-0 left-0 z-30 hidden h-screen w-[50px] flex-col items-center justify-between py-5 md:flex">
            <div className="flex flex-col items-center justify-center">
              <Avatar>
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex flex-col items-center gap-4">
              <TooltipProvider>
                {navItems.map((item) => (
                  <Tooltip key={item.href}>
                    <TooltipTrigger asChild>
                      <Link
                        className="hover:bg-muted/20 rounded-full p-2"
                        href={item.href}
                      >
                        {item.icon}
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">{item.label}</TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </div>
            <div className="flex flex-col items-center gap-4">
              <SettingsIcon
                size={40}
                className="text-background hover:bg-muted/20 cursor-pointer rounded-full p-2"
              />
              <LogOutIcon
                onClick={handleLogout}
                size={40}
                className="text-background hover:bg-muted/20 cursor-pointer rounded-full p-2"
              />
            </div>
          </div>

          {/* Mobile Bottom Bar */}
          <div className="bg-secondary fixed bottom-0 left-0 z-30 flex h-14 w-full items-center justify-between px-2 md:hidden">
            <div className="flex w-fit flex-row items-center justify-between gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="hover:bg-muted/20 rounded-full p-2"
                >
                  {item.icon}
                </Link>
              ))}
            </div>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            <div className="flex flex-row items-center gap-1">
              <SettingsIcon
                size={40}
                className="text-background hover:bg-muted/20 cursor-pointer rounded-full p-2"
              />
              <LogOutIcon
                onClick={handleLogout}
                size={40}
                className="text-background hover:bg-muted/20 cursor-pointer rounded-full p-2"
              />
            </div>
          </div>

          {/* Main Content */}
          <main className="bg-accent min-h-screen w-full">{children}</main>
        </div>
      </AdminProvider>
    </AuthenticationProvider>
  );
}
