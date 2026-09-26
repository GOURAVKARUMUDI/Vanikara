import Link from "next/link";
import React from "react";
import { ArrowRight } from "lucide-react";

type Variant = "primary" | "secondary" | "ghost" | "inverse";
type Size = "sm" | "md" | "lg";

interface BaseProps {
  variant?: Variant;
  size?: Size;
  /** Adds a trailing arrow that nudges forward on hover. */
  arrow?: boolean;
  className?: string;
  children: React.ReactNode;
}

type LinkButtonProps = BaseProps & {
  href: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  target?: string;
  rel?: string;
  "aria-label"?: string;
};

type NativeButtonProps = BaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    href?: undefined;
  };

export type ButtonProps = LinkButtonProps | NativeButtonProps;

const VARIANT: Record<Variant, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  ghost: "btn-ghost",
  /** For use on always-dark panels (e.g. CYGMA). */
  inverse: "btn-inverse",
};

const SIZE: Record<Size, string> = {
  sm: "btn-sm",
  md: "btn-md",
  lg: "btn-lg",
};

/**
 * Button primitive. Renders a Next.js <Link> for internal hrefs, a plain
 * anchor for external/mailto links, and a <button> otherwise. Hover and
 * press states are pure CSS (see .btn in globals.css).
 */
export default function Button(props: ButtonProps) {
  const { variant = "primary", size = "md", arrow = false, className = "", children } = props;
  const classes = `btn group ${VARIANT[variant]} ${SIZE[size]} ${className}`.trim();

  const content = (
    <>
      {children}
      {arrow && <ArrowRight aria-hidden="true" className="arrow-nudge h-4 w-4 shrink-0" strokeWidth={2} />}
    </>
  );

  if (props.href !== undefined) {
    const { href, onClick, target, rel } = props;
    const isInternal = href.startsWith("/") || href.startsWith("#");
    if (isInternal) {
      return (
        <Link href={href} onClick={onClick} className={classes} aria-label={props["aria-label"]}>
          {content}
        </Link>
      );
    }
    return (
      <a href={href} onClick={onClick} target={target} rel={rel ?? (target === "_blank" ? "noopener noreferrer" : undefined)} className={classes} aria-label={props["aria-label"]}>
        {content}
      </a>
    );
  }

  const { variant: _v, size: _s, arrow: _a, className: _c, children: _ch, type = "button", ...rest } = props;
  return (
    <button type={type} className={classes} {...rest}>
      {content}
    </button>
  );
}
