import { ReactNode } from "react";

interface FilterOptionProps {
  label: string;
  children: ReactNode;
}

export function FilterOption({ label, children }: FilterOptionProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs">{label}</label>
      {children}
    </div>
  );
}
