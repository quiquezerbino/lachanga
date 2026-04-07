"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/auth-context";
import { Menu, LogOut, LayoutDashboard } from "lucide-react";
import Image from "next/image";
import { NotificationsBell } from "@/components/notifications-bell";
import { UserAvatar } from "@/components/user-avatar";

const navLinks = [
  { href: "/explorar", label: "Buscar tareas" },
  { href: "/como-funciona", label: "Cómo funciona" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/icon-lachanga.png"
            alt="La Changa"
            width={40}
            height={40}
            className="h-8 w-auto md:h-10"
            priority
          />
          <span className="text-lg font-bold text-foreground md:text-xl">La Changa</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-4 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}

          {user ? (
            <>
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <NotificationsBell />
              <Link href={`/perfil/${user.id}`} className="flex items-center gap-2 transition-opacity hover:opacity-80">
                <UserAvatar src={profile?.avatar_url} name={profile?.full_name} size="sm" />
                <span className="text-sm font-medium text-foreground">
                  {profile?.full_name?.split(" ")[0] || "Mi cuenta"}
                </span>
              </Link>
              <Link href="/publicar" className={buttonVariants()}>
                Publicar tarea
              </Link>
              <Button variant="ghost" size="icon" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Iniciar sesión
              </Link>
              <Link href="/registro" className={buttonVariants()}>
                Registrate
              </Link>
            </>
          )}
        </nav>

        {/* Mobile nav */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger className="md:hidden inline-flex items-center justify-center rounded-md h-9 w-9 hover:bg-accent hover:text-accent-foreground cursor-pointer">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Menú</span>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <nav className="mt-8 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-lg font-medium text-foreground"
                >
                  {link.label}
                </Link>
              ))}

              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setOpen(false)}
                    className="text-lg font-medium text-foreground"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/publicar"
                    onClick={() => setOpen(false)}
                    className={buttonVariants({ className: "mt-2" })}
                  >
                    Publicar tarea
                  </Link>
                  <button
                    onClick={() => {
                      setOpen(false);
                      handleSignOut();
                    }}
                    className="mt-2 text-left text-sm text-muted-foreground hover:text-foreground"
                  >
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="text-lg font-medium text-foreground"
                  >
                    Iniciar sesión
                  </Link>
                  <Link
                    href="/registro"
                    onClick={() => setOpen(false)}
                    className={buttonVariants({ className: "mt-2" })}
                  >
                    Registrate
                  </Link>
                </>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
