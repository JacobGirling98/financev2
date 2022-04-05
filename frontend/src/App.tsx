import { useEffect } from "react";
import "./App.css";
import { useAppDispatch, useAppSelector } from "./hooks/redux";
import { fetchFormOptions } from "./stores/FormOptionsSlice";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import HomePage from "./views/HomePage/HomePage";
import { FormOptionsProvider } from "./context/FormOptions";

function App() {
  const dispatch = useAppDispatch();
  const formOptionsStatus = useAppSelector(state => state.formOptions.status);

  useEffect(() => {
    if (formOptionsStatus === "idle") {
      dispatch(fetchFormOptions());
    }
  }, [formOptionsStatus, dispatch]);

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <FormOptionsProvider>
        <HomePage />
        <ReactQueryDevtools />
      </FormOptionsProvider>
    </QueryClientProvider>
  );
}

export default App;
