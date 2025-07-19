import { BellDot, Search } from "lucide-react";
import { useState } from "react";
import { Input } from "../ui/input";
import { SidebarTrigger } from "../ui/sidebar";

export default function PageHeader() {
  const [search, setSearch] = useState("");

  return (
    <header className="flex h-16 w-full shrink-0 flex-row items-center gap-4 border-b px-4">
      <SidebarTrigger className="md:hidden" />
      <Input
        icon={<Search size={16} className="text-muted-foreground" />}
        placeholder="Search website..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            // Handle search logic here
            console.log("Searching for:", search);
          }
        }}
      />
      <div className="flex w-full flex-1 flex-row items-center justify-end gap-4">
        <BellDot size={20} />
      </div>
    </header>
  );
}
