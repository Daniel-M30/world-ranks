import { useQueries, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { LayoutPage } from "../components/LayoutPage";
import { Fragment } from "react";

type CountryInfoData = {
  id: string;
  area: number;
  name: string;
  officialName: string;
  capital: string;
  flag: string;
  neighbors: string[];
  continents: string;
  currencies: string;
  languages: string;
  subregion: string;
  population: number;
};

export function CountryInfo() {
  const { countryId } = useParams();
  const navigate = useNavigate();
  const { data: country } = useQuery({
    queryKey: ["country", countryId],
    queryFn: async (): Promise<CountryInfoData> => {
      const response = await fetch(`https://restcountries.com/v3.1/alpha/${countryId}`);
      const data = await response.json();

      const countryData = data[0];
      const currencies = Object.values(countryData.currencies).map((currency: any) => currency.name);
      const languages = Object.values(countryData.languages).map((language: any) => language);

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
        flag: countryData.flags.png,
        currencies: currencies.join(", "),
        languages: languages.join(", "),
      };
    },
  });

  const numberFields = {
    population: "Population",
    area: "Area (km²)",
  };

  const infoFields = {
    capital: "Capital",
    subregion: "Subregion",
    languages: "Languages",
    currencies: "Currencies",
    continents: "Continents",
  };

  function formatNumber(number: number) {
    if (!number) return "";

    return number.toLocaleString("en", { minimumFractionDigits: 0 });
  }

  const results = useQueries({
    queries: country?.neighbors?.length
      ? country.neighbors.map((item) => ({
          queryKey: ["country", item],
          queryFn: async (): Promise<Partial<CountryInfoData>> => {
            const response = await fetch(`https://restcountries.com/v3.1/alpha/${item}`);
            const data = await response.json();

            const countryData = data[0];

            return {
              id: countryData.cca3,
              name: countryData.name.common,
              flag: countryData.flags.png,
            };
          },
        }))
      : [],
  });

  if (!country) return <div>Loading...</div>;

  return (
    <LayoutPage key={countryId} className="w-full md:w-[80%] items-center gap-10 rounded-none md:rounded-lg">
      <div className="flex flex-col justify-center items-center gap-6 w-full -mt-8">
        <img className="w-3xs md:w-80 rounded-2xl" src={country.flag} alt="" />
        <div className="text-center">
          <h1 className="text-[32px]">{country.name}</h1>
          <p>{country.officialName}</p>
        </div>

        <div className="flex flex-wrap justify-center gap-8">
          {Object.entries(numberFields).map(([key, value]) => (
            <div key={key} className="flex items-center gap-y-6 gap-x-4 px-5 py-2 rounded-lg bg-charleston-green">
              <p className="py-1">{value}</p>
              <div className="h-full border border-eerie-black" />
              {formatNumber(country[key])}
            </div>
          ))}
        </div>
      </div>

      <div className="w-full">
        <hr className="w-full border-charleston-green" />

        {Object.entries(infoFields).map(([key, value]) => (
          <Fragment key={key}>
            <div className="flex justify-between p-6">
              <p>{value}</p>
              <p>{country[key]}</p>
            </div>
            <hr className="w-full border-charleston-green" />
          </Fragment>
        ))}

        <div className="flex flex-col gap-4 p-6">
          <p>Neighbouring Countries</p>
          <div className="flex flex-wrap gap-4">
            {results.length ? (
              results
                .filter((result) => !!result.data)
                .map((result) => {
                  const neighborCountry = result.data;

                  return (
                    <div
                      key={neighborCountry.id}
                      className="flex flex-col gap-1 cursor-pointer"
                      onClick={() => navigate(`/country/${neighborCountry.id}`)}
                    >
                      <img className="w-24 h-14 rounded-lg" src={neighborCountry.flag} alt="" />
                      <p className="text-center">{neighborCountry.name}</p>
                    </div>
                  );
                })
            ) : (
              <div>No neighbouring Countries</div>
            )}
          </div>
        </div>
      </div>
    </LayoutPage>
  );
}
