import axios from "axios"
import { DATE_RANGES_URL, VIEW_MONEY_SUMMARY_URL, VIEW_MONEY_TRANSACTIONS_URL } from "../utils/api-urls"

export const getDateRanges = async () => {
  const respose = await axios.get(
    DATE_RANGES_URL
  );
  return respose.data;
}

export const getSummary = async (startDate: string, endDate: string) => {
  const response = await axios.get(
    VIEW_MONEY_SUMMARY_URL, { params: { start: startDate, end: endDate } }
  );
  return response.data;
}

export const getTransactions = async (start: string, end: string) => {
  const response = await axios.get(
    VIEW_MONEY_TRANSACTIONS_URL, { params: { start, end } }
  );
  return response;
}

// const formatDateRequestParam = (date: Date): string => {
//   const split: string[] = date.toString().split(" ");
//   return `${split[3]}-${monthToNumber(split[2])}-${split[1]}`
// }

// const monthToNumber = (month: string): string => {
//   switch (month.toLowerCase()) {
//     case "jan":
//       return "1";
//     case "feb":
//       return "2";
//     case "mar":
//       return "3"
//     case "apr":
//       return "4"
//     case "may":
//       return "5"
//     case "jun":
//       return "6"
//     case "jul":
//       return "7"
//     case "aug":
//       return "8"
//     case "sep":
//       return "9"
//     case "oct":
//       return "10"
//     case "nov":
//       return "11"
//     case "dec":
//       return "12"
//     default:
//       return "0"
//   }
// }