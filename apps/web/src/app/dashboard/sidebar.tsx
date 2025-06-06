"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarRail,
} from "@/components/ui/sidebar";
import { links } from "@/lib/menu";
import { GuildWithMembers } from "@/types/database";
import { cn } from "@albion-raid-manager/common/helpers/classNames";
import { getServerPictureUrl, getUserPictureUrl } from "@albion-raid-manager/discord/helpers";
import {
  faArrowRightFromBracket,
  faCheck,
  faChevronDown,
  faPlus,
  faShield,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useDashboardContext } from "./context";

interface GuildSelectionProps {
  guild?: GuildWithMembers;
  icon?: IconDefinition;
}

export function DashboardSidebar() {
  const { guilds, selectedGuild } = useDashboardContext();

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <GuildSelection guild={selectedGuild} icon={faChevronDown} />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-60" align="start">
            {guilds.map((guild) => (
              <Link key={guild.id} href={`/dashboard/${guild.id}`}>
                <DropdownMenuItem>
                  <GuildSelection guild={guild} icon={guild === selectedGuild ? faCheck : undefined} />
                </DropdownMenuItem>
              </Link>
            ))}
            {guilds.length > 0 && <DropdownMenuSeparator />}
            <Link href="/create">
              <DropdownMenuItem>
                <FontAwesomeIcon icon={faPlus} className="size-4" />
                <div className="leading-normal">Add Server</div>
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarHeader>

      <SidebarContent>
        {selectedGuild && (
          <SidebarGroup>
            <SidebarGroupLabel>Menu</SidebarGroupLabel>
            <SidebarMenu>
              {links.map((link) => (
                <Collapsible defaultOpen key={link.label}>
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton asChild>
                        <Link href={link.submenu ? "#" : `/dashboard/${selectedGuild.id}/${link.href}`}>
                          <FontAwesomeIcon icon={link.icon} />
                          <span>{link.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      {link.submenu && (
                        <SidebarMenuSub>
                          {link.submenu.map((sublink) => (
                            <SidebarMenuSubButton asChild key={sublink.href}>
                              <Link href={`/dashboard/${selectedGuild.id}/${link.href}/${sublink.href}`}>
                                <span className="pl-1.5">{sublink.label}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          ))}
                        </SidebarMenuSub>
                      )}
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <UserInfo />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

export function GuildSelection({ guild, icon }: GuildSelectionProps) {
  return (
    <div className="flex w-full items-center gap-2">
      <div
        className={cn(
          "text-sidebar-primary-foreground relative flex aspect-square size-8 items-center justify-center",
          { "bg-sidebar-primary rounded-lg": !guild },
        )}
      >
        {guild ? (
          <Avatar>
            <AvatarImage src={getServerPictureUrl(guild.discordId, guild.icon)} />
            <AvatarFallback>{guild.name?.substring(0, 1).toUpperCase()}</AvatarFallback>
          </Avatar>
        ) : (
          <FontAwesomeIcon icon={faShield} className="size-4" />
        )}
      </div>

      <div className={cn("leading-right flex min-w-0 grow flex-col whitespace-nowrap")}>
        <span className="truncate font-semibold">{guild ? guild.name : "Select server"} </span>
        <span className="text-muted-foreground text-xs">{!guild && "No server selected"}</span>
      </div>

      {icon && <FontAwesomeIcon icon={icon} className="ml-auto size-4 data-[state=collapsed]:hidden" />}
    </div>
  );
}

export function UserInfo() {
  const session = useSession();
  if (!session?.data?.user) return null;

  const { user } = session.data;
  return (
    <>
      <div className="flex min-w-0 items-center gap-2">
        <Avatar>
          <AvatarImage src={user.image || getUserPictureUrl(user.id)} />
          <AvatarFallback>{user.name?.substring(0, 1).toUpperCase()}</AvatarFallback>
        </Avatar>

        <div className="flex min-w-0 flex-col text-sm group-data-[collapsible=icon]:hidden">
          <span className="truncate font-semibold">@{user.name || "Unknown User"}</span>
          <span className="truncate text-xs leading-tight">{user.email}</span>
        </div>
      </div>

      <SidebarMenuAction
        onClick={() =>
          signOut({
            callbackUrl: "/",
          })
        }
      >
        <FontAwesomeIcon icon={faArrowRightFromBracket} />
      </SidebarMenuAction>
    </>
  );
}
