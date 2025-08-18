import React from "react";
type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline";
};
export default function Button({
  variant = "default",
  className = "",
  ...rest
}: Props) {
  const base = "btn " + (variant === "outline" ? "" : "btn-primary");
  return <button className={`${base} ${className}`} {...rest} />;
}
