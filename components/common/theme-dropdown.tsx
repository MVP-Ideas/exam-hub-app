"use client";

import { Monitor, Sun, Moon, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { createElement } from "react";

interface ThemeDropdownProps {
  variant?: "ghost" | "outline" | "default" | "destructive" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  showLabel?: boolean;
}

export function ThemeDropdown({
  variant = "ghost",
  size = "default",
  className = "",
  showLabel = true,
}: ThemeDropdownProps) {
  const { theme, setTheme } = useTheme();

  const themeOptions = [
    {
      label: "Light",
      value: "light",
      icon: Sun,
    },
    {
      label: "Dark",
      value: "dark",
      icon: Moon,
    },
    {
      label: "System",
      value: "system",
      icon: Monitor,
    },
  ];

  const getCurrentThemeLabel = () => {
    const currentTheme = themeOptions.find((option) => option.value === theme);
    return currentTheme ? currentTheme.label : "System";
  };

  const getCurrentThemeIcon = () => {
    const currentTheme = themeOptions.find((option) => option.value === theme);
    return currentTheme ? currentTheme.icon : Monitor;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={`w-full justify-start gap-2 ${className}`}
        >
          {createElement(getCurrentThemeIcon(), {
            className: "h-4 w-4",
          })}
          {showLabel && `Theme: ${getCurrentThemeLabel()}`}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="dropdown-menu-content">
        {themeOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => setTheme(option.value)}
            className="flex items-center justify-between"
          >
            <div className="flex items-center">
              <option.icon className="mr-2 h-4 w-4" />
              {option.label}
            </div>
            {theme === option.value && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
