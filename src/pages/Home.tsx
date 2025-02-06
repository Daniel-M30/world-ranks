import searchIcon from "../assets/icons/Search.svg";
import { useQuery } from "@tanstack/react-query";
import { FilterOption } from "../components/FilterOption";
import { TableCell } from "../components/Table/TableCell";
import { useEffect, useRef, useState } from "react";
import { TableHeader } from "../components/Table/TableHeader";
import { useNavigate } from "react-router";
import { LayoutPage } from "../components/LayoutPage";

type CountryData = {
  id: string;
  name: string;
  flag: string;
  population: number;
  area: number;
  region: string;
};

export function Home() {
  const [visibleContries, setVisibleCountries] = useState<CountryData[]>([]);
  const [sortBy, setSortBy] = useState<"population" | "area">("population");
  const ordenedCountries = useRef<CountryData[]>([]);
  const navigate = useNavigate();

  const { data } = useQuery({
    queryKey: ["countries"],
    queryFn: async (): Promise<CountryData[]> => {
      const response = await fetch("https://restcountries.com/v3.1/all");
      const data = await response.json();

      const formattedContries = data.map((country: any) => ({
        id: country.cca3,
        name: country.name.common,
        flag: country.flags.png,
        population: country.population,
        area: country.area,
        region: country.region,
      })) as CountryData[];

      return formattedContries;
    },
  });

  useEffect(() => {
    if (!data?.length) return;

    ordenedCountries.current = data.sort((a, b) => b[sortBy] - a[sortBy]);
    setVisibleCountries(ordenedCountries.current.slice(0, 50));
  }, [data, sortBy]);

  function formatNumber(number: number) {
    return number.toLocaleString("en", { maximumFractionDigits: 0 });
  }

  return (
    <LayoutPage className="w-[95%] px-4 py-6 md:w-[90%] md:p-6">
      <div className="flex flex-col gap-6 justify-between items-start md:flex-row md:items-center">
        <p>Found 234 countries</p>
        <div className="bg-charleston-green flex items-center gap-2 rounded-lg p-2 w-full md:w-max">
          <img src={searchIcon} alt="Search icon" />
          <input className="outline-none w-3xs" type="text" placeholder="Search by Name, Region, Subregion" />
        </div>
      </div>

      <div className="flex gap-6 flex-col md:flex-row">
        <div className="flex flex-col gap-8 w-full md:w-1/4">
          <FilterOption label="Sort by">
            <select
              onSelect={() => setSortBy("area")}
              className="outline-none border-2 border-charleston-green p-2 rounded-xl text-sm"
              name="SortBy"
            >
              <option value="population">Population</option>
            </select>
          </FilterOption>

          <FilterOption label="Region">
            <div>
              <button className="bg-charleston-green py-2 px-3 rounded-xl text-sm cursor-pointer">Americas</button>
            </div>
          </FilterOption>

          <FilterOption label="Status">
            <div className="flex items-center gap-2">
              <input type="checkbox" />
              <span>Independet</span>
            </div>
          </FilterOption>
        </div>

        <table className="w-full table-fixed border-collapse h-max md:w-3/4">
          <thead>
            <tr className="border-b-2 border-charleston-green">
              <TableHeader className="w-12 pr-4">Flag</TableHeader>
              <TableHeader className="pr-4">Name</TableHeader>
              <TableHeader className="pr-4">Population</TableHeader>
              <TableHeader>Area (km²)</TableHeader>
              <TableHeader className="hidden pl-4 lg:block">Region</TableHeader>
            </tr>
          </thead>
          <tbody>
            {visibleContries?.length ? (
              visibleContries
                .sort((a, b) => b.population - a.population)
                .map((country) => (
                  <tr key={country.id} className="cursor-pointer" onClick={() => navigate(`/country/${country.id}`)}>
                    <TableCell className="w-12 pr-4">
                      <img className="w-full h-full rounded-lg" src={country.flag} alt="Flag" />
                    </TableCell>
                    <TableCell className="pr-4">{country.name}</TableCell>
                    <TableCell className="pr-4">{formatNumber(country.population)}</TableCell>
                    <TableCell>{formatNumber(country.area)}</TableCell>
                    <TableCell className="items-center pl-4 hidden lg:flex">{country.region}</TableCell>
                  </tr>
                ))
            ) : (
              <tr></tr>
            )}
          </tbody>
        </table>
      </div>
    </LayoutPage>
  );
}
