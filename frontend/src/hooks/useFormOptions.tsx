import React from "react";
import { useQuery } from "react-query";
import { getFormOptions } from "../api/FormOptions";

interface FormOptionsReturn {
  accounts: string[];
  categories: string[];
  descriptions: string[];
  incomeSources: string[];
  payees: string[];
  render: boolean;
}

const useFormOptions = (): FormOptionsReturn => {
  const { data: accounts } = useQuery(
    "fetchAccounts",
    () => getFormOptions("accounts"),
    { refetchOnMount: false }
  );
  const { data: categories } = useQuery(
    "fetchCategories",
    () => getFormOptions("categories"),
    { refetchOnMount: false }
  );
  const { data: descriptions } = useQuery(
    "fetchDescriptions",
    () => getFormOptions("descriptions"),
    { refetchOnMount: false }
  );
  const { data: incomeSources } = useQuery(
    "fetchSources",
    () => getFormOptions("income_source"),
    { refetchOnMount: false }
  );
  const { data: payees } = useQuery(
    "fetchPayees",
    () => getFormOptions("payees"),
    { refetchOnMount: false }
  );

  const render =
    accounts !== undefined &&
    categories !== undefined &&
    descriptions !== undefined &&
    incomeSources !== undefined &&
    payees !== undefined;

  return {
    accounts: accounts ?? [],
    categories: categories ?? [],
    descriptions: descriptions ?? [],
    incomeSources: incomeSources ?? [],
    payees: payees ?? [],
    render
  }
};

export default useFormOptions;
