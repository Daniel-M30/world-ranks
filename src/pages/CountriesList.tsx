import searchIcon from "../assets/icons/Search.svg";
import { useQuery } from "@tanstack/react-query";
import { FilterOption } from "../components/FilterOption";
import { TableCell } from "../components/Table/TableCell";
import { useEffect, useRef, useState } from "react";
import { TableHeader } from "../components/Table/TableHeader";
import { useNavigate } from "react-router";
import { LayoutPage } from "../components/LayoutPage";
import { RegionData, SortByData, StatusData } from "../contexts/CountriesFilterContext";

type CountriesListData = {
  id: string;
  name: string;
  flag: string;
  population: number;
  area: number;
  region: RegionData;
  subregion: string;
  independent: boolean;
};

export function CountriesList() {
  const [visibleContries, setVisibleCountries] = useState<CountriesListData[]>([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortByData>("population");
  const [region, setRegion] = useState<RegionData[]>(["africa", "americas", "asia", "europe", "oceania", "antarctic"]);
  const [status, setStatus] = useState<{ [key in StatusData]: boolean }>({
    independent: false,
    unMember: false,
  });

  const ordenedCountries = useRef<CountriesListData[]>([]);
  const navigate = useNavigate();

  const sortOptions: { [key in SortByData]: string } = {
    population: "Population",
    area: "Area",
    name: "Name",
    region: "Region",
  };

  const regionsOptions: { [key in RegionData]: string } = {
    americas: "Americas",
    antarctic: "Antarctic",
    africa: "Africa",
    asia: "Asia",
    europe: "Europe",
    oceania: "Oceania",
  };

  const statusOptions: { [key in StatusData]: string } = {
    unMember: "Member of the United Nations",
    independent: "Independent",
  };

  const { data } = useQuery({
    queryKey: ["countries"],
    queryFn: async () => {
      const response = await fetch("https://restcountries.com/v3.1/all");
      const data = await response.json();

      const formattedContries: CountriesListData[] = data.map((country: any) => ({
        id: country.cca3,
        name: country.name.common,
        flag: country.flags.png,
        population: country.population,
        area: country.area,
        region: country.region.toLowerCase(),
        independent: country.independent,
        unMember: country.unMember,
        subregion: country.subregion,
      }));

      return formattedContries;
    },
  });

  useEffect(() => {
    if (!data?.length) return;

    const searchFields = ["name", "region", "subregion"];
    const searchRegex = new RegExp(search, "i");

    ordenedCountries.current = data.filter(
      (country) =>
        (!search || searchFields.some((field) => country[field] && country[field].search(searchRegex) !== -1)) &&
        region.includes(country.region) &&
        Object.keys(statusOptions).every((key) => !status[key] || country[key] === status[key])
    );
    ordenedCountries.current.sort((a, b) => {
      if (sortBy === "population" || sortBy === "area") return b[sortBy] - a[sortBy];

      return a[sortBy].localeCompare(b[sortBy]);
    });

    setVisibleCountries(ordenedCountries.current.slice(0, 50));
  }, [data, region, sortBy, status, search]);

  function formatNumber(number: number) {
    return number.toLocaleString("en", { maximumFractionDigits: 0 });
  }

  function handleSeletedRegions(value: RegionData) {
    if (region.includes(value)) {
      if (region.length === 1) return;

      setRegion((prev) => prev.filter((item) => item !== value));
      return;
    }

    setRegion((prev) => [...prev, value]);
  }

  function handleSeletedStatus(value: StatusData) {
    setStatus((prev) => ({
      ...prev,
      [value]: !prev[value],
    }));
  }

  return (
    <LayoutPage className="w-[95%] px-4 py-6 md:w-[90%] md:p-6">
      <div className="flex flex-col gap-6 justify-between items-start md:flex-row md:items-center">
        <p>Found {ordenedCountries.current.length} countries</p>
        <div className="bg-charleston-green flex items-center gap-2 rounded-lg p-2 w-full md:w-max">
          <img src={searchIcon} alt="Search icon" />
          <input
            className="outline-none w-3xs"
            type="text"
            placeholder="Search by Name, Region, Subregion"
            onChange={(ev) => setSearch(ev.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-6 flex-col md:flex-row">
        <div className="flex flex-col gap-8 w-full md:w-1/4">
          <FilterOption label="Sort by">
            <select
              onChange={(ev) => setSortBy(ev.target.value as SortByData)}
              className="outline-none border-2 border-charleston-green p-2 rounded-xl text-sm"
              name="SortBy"
            >
              {Object.entries(sortOptions).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>
          </FilterOption>

          <FilterOption label="Region">
            <div className="flex flex-wrap gap-3">
              {Object.entries(regionsOptions).map(([key, value]) => (
                <button
                  key={key}
                  className={`${region.includes(key as RegionData) ? "bg-charleston-green" : ""}
                  py-2 px-3 rounded-xl text-sm cursor-pointer`}
                  onClick={() => handleSeletedRegions(key as RegionData)}
                >
                  {value}
                </button>
              ))}
            </div>
          </FilterOption>

          <FilterOption label="Status">
            {Object.entries(statusOptions).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2">
                <input type="checkbox" onChange={() => handleSeletedStatus(key as StatusData)} />
                <span>{value}</span>
              </div>
            ))}
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
              visibleContries.map((country) => (
                <tr key={country.id} className="cursor-pointer" onClick={() => navigate(`/country/${country.id}`)}>
                  <TableCell className="w-12 pr-4">
                    <img className="w-full h-full rounded-lg" src={country.flag} alt={`${country.name} flag`} />
                  </TableCell>
                  <TableCell className="pr-4">{country.name}</TableCell>
                  <TableCell className="pr-4">{formatNumber(country.population)}</TableCell>
                  <TableCell>{formatNumber(country.area)}</TableCell>
                  <TableCell className="items-center pl-4 hidden lg:flex">{regionsOptions[country.region]}</TableCell>
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
