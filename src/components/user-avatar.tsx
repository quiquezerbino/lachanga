"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface UserAvatarProps {
  src: string | null | undefined;
  name: string | null | undefined;
  size?: "sm" | "default" | "lg";
  className?: string;
}

export function UserAvatar({ src, name, size = "default", className }: UserAvatarProps) {
  const initial = name?.charAt(0)?.toUpperCase() || "?";

  return (
    <Avatar size={size} className={className}>
      {src && <AvatarImage src={src} alt={name || "Avatar"} />}
      <AvatarFallback>{initial}</AvatarFallback>
    </Avatar>
  );
}
