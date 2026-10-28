"use client";

import { Suspense, useEffect } from "react";
import Link from "next/link";
import { Search, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CREDITS_PER_MONTH, useCredits } from "@/store/credits";
import { MobileNav } from "./mobile-nav";
import { useScripts } from "@/store/scripts";
import { useIdeas } from "@/store/ideas";
import { useSavedHooks } from "@/store/hooks";
import { useProjects } from "@/store/projects";
import { useAccounts } from "@/store/accounts";
import { useWatchlist } from "@/store/watchlist";
export function TopBar() {
  const balance = useCredits((s) => s.balance);

  useEffect(() => {
    useCredits.persist.rehydrate();
    useScripts.persist.rehydrate();
    useIdeas.persist.rehydrate();
    useSavedHooks.persist.rehydrate();
    useProjects.persist.rehydrate();
    useAccounts.persist.rehydrate();
    useWatchlist.persist.rehydrate();
  }, []);

  return (
    <header className="flex h-14 items-center gap-3 border-b border-border px-4 md:px-6">
      <Suspense fallback={null}>
        <MobileNav />
      </Suspense>

      <div className="relative max-w-md flex-1">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search videos, channels, hooks..." className="pl-9" />
      </div>

      <div className="ml-auto flex items-center gap-3">
        <Link href="/app/settings/subscription" title="Credits remaining this month">
          <Badge
            variant={balance === 0 ? "destructive" : "secondary"}
            className="gap-1 px-3 py-1"
          >
            <Zap className="size-3" />
            {balance} / {CREDITS_PER_MONTH} credits
          </Badge>
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger className="rounded-full outline-none">
            <Avatar>
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <Link href="/app/settings/profile">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/app/settings/subscription">Subscription</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/">Log out</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}