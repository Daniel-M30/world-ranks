import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { LayoutPage } from "../components/LayoutPage";

type CountryData = {
  id: string;
  area: number;
  name: string;
  officialName: string;
  capital: string;
  neighbors: string[];
  continents: string[];
  currencies: string[];
  subregion: string;
  population: number;
};

export function Country() {
  const { countryId } = useParams();

  const { data } = useQuery({
    queryKey: ["country", countryId],
    queryFn: async (): Promise<CountryData> => {
      const response = await fetch(`https://restcountries.com/v3.1/alpha/${countryId}`);
      const data = await response.json();

      const countryData = data[0];
      const currencies = Object.values(countryData.currencies).map((currency: any) => currency.name);

      return {
        id: countryData.cca3,
        area: countryData.area,
        name: countryData.name.common,
        officialName: countryData.name.official,
        neighbors: countryData.borders,
        population: countryData.population,
        subregion: countryData.subregion,
        capital: countryData.capital.join(", "),
        continents: countryData.continents.join(", "),
        currencies,
      };
    },
  });

  if (!data) return <div>Loading...</div>;

  console.log(data);
  return (
    <LayoutPage className="w-full">
      <div>{data.name}</div>
    </LayoutPage>
  );
}
