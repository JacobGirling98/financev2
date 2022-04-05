import { useQuery } from "react-query";
import { getAllFormOptions } from "../api/FormOptions";
import { useFormOptionsContext } from "../context/FormOptions";
import { DescriptionMapping, GetAllFormOptionsData } from "../types/types";

interface FormOptionsReturn {
  accounts: string[];
  categories: string[];
  descriptions: string[];
  descriptionMappings: DescriptionMapping[];
  incomeSources: string[];
  payees: string[];
  render: boolean;
}

const useFormOptions = (): FormOptionsReturn => {
  const {
    descriptions,
    setDescriptions,
    descriptionMappings,
    setDescriptionMappings,
  } = useFormOptionsContext();

  const { data } = useQuery("fetchAllFormOptions", () => getAllFormOptions(), {
    staleTime: 1000000000000,
    onSuccess: (data: GetAllFormOptionsData) => {
      setDescriptions(data.descriptions);
      setDescriptionMappings(data.descriptionMappings)
    },
  });

  const render: boolean =
    data !== undefined &&
    data.accounts !== undefined &&
    data.categories !== undefined &&
    descriptions &&
    descriptionMappings &&
    data.incomeSource !== undefined &&
    data.payees !== undefined;

  return {
    accounts: data?.accounts ?? [],
    categories: data?.categories ?? [],
    descriptions,
    descriptionMappings,
    incomeSources: data?.incomeSource ?? [],
    payees: data?.payees ?? [],
    render,
  };
};

export default useFormOptions;
