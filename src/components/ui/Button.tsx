import Link from "next/link";
import React from "react";
import { ArrowRight, Loader2 } from "lucide-react";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "inverse" | "inverse-outline" | "destructive";
type Size = "sm" | "md" | "lg";

interface BaseProps {
  variant?: Variant;
  size?: Size;
  arrow?: boolean;
  loading?: boolean;
  /** Kept for backwards compatibility; magnetic cursor pull removed in V2. */
  magnetic?: boolean;
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
  outline: "btn-outline",
  ghost: "btn-ghost",
  inverse: "btn-inverse",
  "inverse-outline": "btn-inverse-outline",
  destructive: "btn-destructive",
};

const SIZE: Record<Size, string> = {
  sm: "btn-sm",
  md: "btn-md",
  lg: "btn-lg",
};

export default function Button(props: ButtonProps) {
  const { variant = "primary", size = "md", arrow = false, loading = false, className = "", children } = props;
  const classes = `btn group ${VARIANT[variant]} ${SIZE[size]} ${className}`.trim();

  const content = (
    <>
      {loading && <Loader2 aria-hidden="true" className="h-4 w-4 shrink-0 animate-spin" />}
      {children}
      {arrow && !loading && <ArrowRight aria-hidden="true" className="arrow-nudge h-4 w-4 shrink-0" strokeWidth={2} />}
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
      <a
        href={href}
        onClick={onClick}
        target={target}
        rel={rel ?? (target === "_blank" ? "noopener noreferrer" : undefined)}
        className={classes}
        aria-label={props["aria-label"]}
      >
        {content}
      </a>
    );
  }

  const {
    variant: _v,
    size: _s,
    arrow: _a,
    loading: _l,
    magnetic: _m,
    className: _c,
    children: _ch,
    type = "button",
    disabled,
    ...rest
  } = props;

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {content}
    </button>
  );
}
