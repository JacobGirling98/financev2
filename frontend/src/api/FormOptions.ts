import axios from "axios";
import { FinanceApiResponse, GetAllFormOptionsData } from "../types/types";
import { BASE_URL, FORM_OPTIONS_URL } from "../utils/api-urls";

export const getAllFormOptions = async () => {
  const response: FinanceApiResponse<GetAllFormOptionsData> = await axios.get(
    FORM_OPTIONS_URL
  );
  return response.data;
}

export const getFormOptions = async (dataType: string) => {
  const response: { data: FinanceApiResponse<string[]> } = await axios.get(
    BASE_URL + "form_options", { params: { dataType } }
  );
  return response.data.data;
}