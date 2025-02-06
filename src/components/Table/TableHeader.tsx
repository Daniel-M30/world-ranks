import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

interface TableHeaderProps extends ComponentProps<"th"> {}

export function TableHeader({ children, className, ...rest }: TableHeaderProps) {
  return (
    <th className={twMerge("text-start text-xs py-4 box-content", className)} {...rest}>
      {children}
    </th>
  );
}
