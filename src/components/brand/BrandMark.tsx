import Image from "next/image";

/** Intrinsic size of /brand/vanikara-symbol.png (trimmed from /logo.png). */
export const SYMBOL_WIDTH = 876;
export const SYMBOL_HEIGHT = 714;
export const SYMBOL_SRC = "/brand/vanikara-symbol.png";

interface SymbolProps {
  /** Rendered height in px. Width follows the symbol's aspect ratio. */
  size?: number;
  className?: string;
  priority?: boolean;
  /** Pass an empty string when the symbol sits next to the wordmark. */
  alt?: string;
  sizes?: string;
}

/**
 * The VANIKARA symbol, rendered from the supplied asset — never redrawn.
 */
export function BrandSymbol({ size = 28, className = "", priority = false, alt = "VANIKARA", sizes }: SymbolProps) {
  const width = Math.round((size * SYMBOL_WIDTH) / SYMBOL_HEIGHT);
  return (
    <Image
      src={SYMBOL_SRC}
      alt={alt}
      width={width}
      height={size}
      priority={priority}
      sizes={sizes}
      className={`select-none ${className}`}
      draggable={false}
    />
  );
}

interface BrandMarkProps {
  /** "full" = symbol + wordmark, "symbol" = symbol only (tight spaces). */
  variant?: "full" | "symbol";
  size?: number;
  className?: string;
  priority?: boolean;
}

/**
 * Brand lockup: symbol + VANIKARA wordmark set in Manrope.
 * Use `variant="symbol"` where horizontal space is limited.
 */
export default function BrandMark({ variant = "full", size = 26, className = "", priority = false }: BrandMarkProps) {
  if (variant === "symbol") {
    return <BrandSymbol size={size} priority={priority} className={className} />;
  }

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <BrandSymbol size={size} priority={priority} alt="" />
      <span
        className="font-extrabold text-fg leading-none tracking-[0.08em]"
        style={{ fontSize: Math.round(size * 0.66) }}
      >
        VANIKARA
      </span>
    </span>
  );
}
