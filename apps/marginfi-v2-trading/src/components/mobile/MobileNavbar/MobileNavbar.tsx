import React, { ReactNode } from "react";

import Link from "next/link";
import { useRouter } from "next/router";
import { IconCoins, IconTrendingUp, IconChartPie, IconPlus } from "@tabler/icons-react";

import { useUiStore } from "~/store";
import { useFirebaseAccount } from "~/hooks/useFirebaseAccount";
import { useOs } from "~/hooks/useOs";
import { cn } from "~/utils/themeUtils";
import { CreatePoolDialog } from "~/components/common/Pool";
import { Button } from "~/components/ui/button";
import { CreatePoolSoon } from "~/components/common/Pool/CreatePoolSoon";

export interface NavLinkInfo {
  href: string;
  alt: string;
  label: string;
  trigger?: (children: ReactNode) => React.JSX.Element;
  Icon: React.ElementType;
}

const CreatePoolTrigger = (children: ReactNode) => {
  return <CreatePoolSoon trigger={children} />;
};

export const mobileLinks: NavLinkInfo[] = [
  {
    href: "/",
    alt: "pools icon",
    label: "pools",
    Icon: IconCoins,
  },
  {
    href: "/trade/59yr2vuW1qv3UVQx9HC6Q8mxns5S6g7fjS8YWgRgaLA7",
    alt: "trade icon",
    label: "trade",
    Icon: IconTrendingUp,
  },

  {
    href: "/portfolio",
    alt: "portfolio icon",
    label: "portfolio",
    Icon: IconChartPie,
  },
  {
    href: "#",
    alt: "create pool icon",
    label: "create pool",
    Icon: IconPlus,
    trigger: CreatePoolTrigger,
  },
];

const MobileNavbar = () => {
  useFirebaseAccount();

  const router = useRouter();
  const [setIsMenuModalOpen, isActionBoxInputFocussed] = useUiStore((state) => [
    state.setIsMenuDrawerOpen,
    state.isActionBoxInputFocussed,
  ]);

  const { isIOS, isPWA } = useOs();

  const activeLink = React.useMemo(() => {
    const fullLink = mobileLinks.findIndex((link) => link.href === router.pathname);
    if (fullLink > -1) return `link${fullLink}`;

    const firstSegment = router.pathname.split("/")[1];
    const firstSegmentLink = mobileLinks.findIndex((link) => link.href.includes(firstSegment));
    if (firstSegmentLink) return `link${firstSegmentLink}`;

    return "linknone";
  }, [router.pathname]);

  if (isActionBoxInputFocussed) return null;

  return (
    <footer>
      <nav className="fixed w-full bottom-0 z-50 bg-background border">
        <div className="h-full w-full text-xs font-normal z-50 flex justify-around relative lg:gap-8">
          {mobileLinks.map((linkInfo, index) => {
            const isActive = activeLink === `link${index}`;

            const trigger = linkInfo.trigger;
            const NavItem = (
              <Link
                key={linkInfo.label}
                onClick={() => linkInfo.label === "more" && setIsMenuModalOpen(true)}
                href={linkInfo.href}
                className={cn(
                  "w-1/4 py-2.5 flex flex-col gap-1 items-center border-t border-solid border-transparent transition-colors",
                  isIOS && isPWA && "pb-8",
                  isActive ? "text-primary border-primary" : "text-muted-foreground"
                )}
              >
                <linkInfo.Icon />
                {linkInfo.label}
              </Link>
            );

            if (trigger) {
              return trigger(NavItem);
            } else {
              return NavItem;
            }
          })}
        </div>
      </nav>
    </footer>
  );
};

export { MobileNavbar };
