import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

interface TableCellProps extends ComponentProps<"td"> {}

export function TableCell({ children, className, ...rest }: TableCellProps) {
  return (
    <td className={twMerge("overflow-ellipsis overflow-hidden text-nowrap box-content h-9 py-4", className)} {...rest}>
      {children}
    </td>
  );
}
