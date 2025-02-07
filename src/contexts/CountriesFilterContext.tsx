import { createContext, ReactNode, useState } from "react";

interface CountriesFilterProviderProps {
  children: ReactNode;
}

export type SortByData = "population" | "area" | "name" | "region";
export type RegionData = "africa" | "americas" | "asia" | "europe" | "oceania" | "antarctic";
export type StatusData = "independent" | "unMember";

type FilterData = {
  sortBy: SortByData;
  regions: RegionData[];
  status: StatusData[];
};

type CountriesFilterContextData = {
  filter: FilterData;
};

export const CountriesFilterContext = createContext({} as CountriesFilterContextData);

export function CountriesFilterProvider({ children }: CountriesFilterProviderProps) {
  const [sortBy] = useState<SortByData>("population");
  const [regions] = useState<RegionData[]>([]);
  const [status] = useState<StatusData[]>([]);

  return (
    <CountriesFilterContext.Provider value={{ filter: { sortBy, status, regions } }}>
      {children}
    </CountriesFilterContext.Provider>
  );
}
