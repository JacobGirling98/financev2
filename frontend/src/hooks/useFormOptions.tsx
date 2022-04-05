import { useQuery } from "react-query";
import { getAllFormOptions } from "../api/FormOptions";
import { useFormOptionsContext } from "../context/FormOptions";
import { GetAllFormOptionsData } from "../types/types";

interface FormOptionsReturn {
  accounts: string[];
  categories: string[];
  descriptions: string[];
  incomeSources: string[];
  payees: string[];
  render: boolean;
}

const useFormOptions = (): FormOptionsReturn => {

  const { descriptions, setDescriptions } = useFormOptionsContext()

  const { data } = useQuery("fetchAllFormOptions", () => 
    getAllFormOptions(),
    { staleTime: 1000000000000, onSuccess: (data: GetAllFormOptionsData) => setDescriptions(data.descriptions) }
  )

  const render: boolean = data !== undefined &&
    data.accounts !== undefined &&
    data.categories !== undefined &&
    descriptions && 
    data.incomeSource !== undefined &&
    data.payees !== undefined;

  return {
    accounts: data?.accounts ?? [],
    categories: data?.categories ?? [],
    descriptions,
    incomeSources: data?.incomeSource ?? [],
    payees: data?.payees ?? [],
    render
  }
};

export default useFormOptions;
