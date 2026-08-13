import React, { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "outline" | "danger" | "transparent";
type Size = "sm" | "md" | "lg";


interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  className?: string;
}

const baseStyles =
  "inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

const variantStyles: Record<Variant, string> = {
  primary: "bg-vp-verde-700 text-white hover:bg-vp-verde-500 focus:ring-vp-verde-500",
  secondary: "bg-vp-teal-700 text-white hover:bg-vp-teal-500 focus:ring-vp-teal-500",
  outline:"border border-vp-azul-700 text-vp-azul-700 hover:bg-gray-50 focus:ring-gray-400",
  danger: "bg-vp-coral-500 text-white hover:bg-vp-coral-700 focus:ring-vp-coral-500",
  transparent: "bg-transparent text-vp-azul-700 hover:bg-gray-50 focus:ring-gray-400",
};

const sizeStyles: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  type = "button",
  className = "",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...rest}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
}
