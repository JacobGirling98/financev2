import { useEffect } from "react";
import "./App.css";
import { useAppDispatch, useAppSelector } from "./hooks/redux";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import HomePage from "./views/HomePage/HomePage";
import { FormOptionsProvider } from "./context/FormOptions";
import { ViewMoneyProvider } from "./context/ViewMoney";

function App() {
  const dispatch = useAppDispatch();

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <FormOptionsProvider>
        <ViewMoneyProvider>
          <HomePage />
          <ReactQueryDevtools />
        </ViewMoneyProvider>
      </FormOptionsProvider>
    </QueryClientProvider>
  );
}

export default App;
