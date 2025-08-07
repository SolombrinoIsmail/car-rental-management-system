"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/lib/hooks/use-theme";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ThemeToggleProps {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}\n\nexport function ThemeToggle({ \n  variant = "outline", \n  size = "icon",\n  className \n}: ThemeToggleProps) {\n  const { setTheme } = useTheme();\n\n  return (\n    <DropdownMenu>\n      <DropdownMenuTrigger asChild>\n        <Button \n          variant={variant} \n          size={size} \n          className={className}\n          aria-label="Toggle theme"\n        >\n          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />\n          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />\n          <span className="sr-only">Toggle theme</span>\n        </Button>\n      </DropdownMenuTrigger>\n      <DropdownMenuContent align="end">\n        <DropdownMenuItem onClick={() => setTheme("light")}>\n          <Sun className="mr-2 h-4 w-4" />\n          <span>Heller Modus</span>\n        </DropdownMenuItem>\n        <DropdownMenuItem onClick={() => setTheme("dark")}>\n          <Moon className="mr-2 h-4 w-4" />\n          <span>Dunkler Modus</span>\n        </DropdownMenuItem>\n        <DropdownMenuItem onClick={() => setTheme("system")}>\n          <Sun className="mr-2 h-4 w-4" />\n          <span>System</span>\n        </DropdownMenuItem>\n      </DropdownMenuContent>\n    </DropdownMenu>\n  );\n}\n\n/**\n * Simple theme toggle button without dropdown\n */\nexport function SimpleThemeToggle({ \n  variant = "outline", \n  size = "icon",\n  className \n}: ThemeToggleProps) {\n  const { theme, setTheme } = useTheme();\n  const [mounted, setMounted] = React.useState(false);\n\n  React.useEffect(() => {\n    setMounted(true);\n  }, []);\n\n  if (!mounted) {\n    return (\n      <Button variant={variant} size={size} className={className}>\n        <div className="h-[1.2rem] w-[1.2rem]" />\n      </Button>\n    );\n  }\n\n  const toggleTheme = () => {\n    if (theme === "light") {\n      setTheme("dark");\n    } else if (theme === "dark") {\n      setTheme("system");\n    } else {\n      setTheme("light");\n    }\n  };\n\n  return (\n    <Button \n      variant={variant} \n      size={size} \n      onClick={toggleTheme}\n      className={className}\n      aria-label="Toggle theme"\n    >\n      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />\n      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />\n    </Button>\n  );\n}