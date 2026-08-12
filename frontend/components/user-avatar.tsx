"use client";

import { User } from "@/lib/types";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  user: Pick<User, "displayName" | "username" | "avatarUrl" | "status">;
  size?: "sm" | "md" | "lg" | "xl";
  showStatus?: boolean;
  className?: string;
}

const statusColors: Record<string, string> = {
  online: "bg-green-400",
  "in-game": "bg-primary",
  away: "bg-yellow-400",
  offline: "bg-muted-foreground",
};

const statusLabels: Record<string, string> = {
  online: "Online",
  "in-game": "In Game",
  away: "Away",
  offline: "Offline",
};

const sizeClasses = {
  sm: "w-8 h-8 text-sm",
  md: "w-10 h-10 text-base",
  lg: "w-14 h-14 text-xl",
  xl: "w-20 h-20 text-3xl",
};

const dotSizes = {
  sm: "w-2.5 h-2.5 border",
  md: "w-3 h-3 border",
  lg: "w-3.5 h-3.5 border-2",
  xl: "w-4 h-4 border-2",
};

export default function UserAvatar({
  user,
  size = "md",
  showStatus = false,
  className,
}: UserAvatarProps) {
  const initials = user.displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className={cn("relative inline-flex shrink-0", className)}>
      <div
        className={cn(
          "rounded-full overflow-hidden bg-secondary flex items-center justify-center font-semibold text-foreground",
          sizeClasses[size]
        )}
        title={user.displayName}
        aria-label={`${user.displayName}'s avatar`}
      >
        {user.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.avatarUrl}
            alt={`${user.displayName}'s avatar`}
            className="w-full h-full object-cover"
          />
        ) : (
          <span>{initials}</span>
        )}
      </div>
      {showStatus && user.status && (
        <span
          className={cn(
            "absolute bottom-0 right-0 rounded-full border-card",
            dotSizes[size],
            statusColors[user.status] ?? statusColors.offline
          )}
          title={statusLabels[user.status] ?? "Offline"}
          aria-label={statusLabels[user.status] ?? "Offline"}
        />
      )}
    </div>
  );
}
