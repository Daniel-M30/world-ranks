import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Home } from "./pages/Home";
import { BrowserRouter, Routes, Route } from "react-router";
import { Country } from "./pages/Country";

export function App() {
  const queryCliente = new QueryClient();

  return (
    <QueryClientProvider client={queryCliente}>
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />} />
          <Route element={<Country />} path="/country/:countryId" />
          <Route element={<Home />} path="*" />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
