import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CountriesList } from "./pages/CountriesList";
import { BrowserRouter, Routes, Route } from "react-router";
import { CountryInfo } from "./pages/CountryInfo";

export function App() {
  const queryCliente = new QueryClient();

  return (
    <QueryClientProvider client={queryCliente}>
      <BrowserRouter>
        <Routes>
          <Route index element={<CountriesList />} />
          <Route element={<CountryInfo />} path="/country/:countryId" />
          <Route element={<CountriesList />} path="*" />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
