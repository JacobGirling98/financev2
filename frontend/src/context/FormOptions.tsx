import React from "react";
import { useContext } from "react";
import { useState } from "react";

interface IFormOptionsContext {
  descriptions: string[];
  setDescriptions: (descriptions: string[]) => void;
}

const defaultState: IFormOptionsContext = {
  descriptions: [],
  setDescriptions: (descriptions: string[]) => {}
}

const FormOptionsContext = React.createContext<IFormOptionsContext>(defaultState);

export const FormOptionsProvider: React.FC = ({ children }) => {
  const [descriptions, setDescriptions] = useState<string[]>([]);

  return (
    <FormOptionsContext.Provider value={{ descriptions, setDescriptions }}>
      {children}
    </FormOptionsContext.Provider>
  )
}

export const useFormOptionsContext = () => useContext(FormOptionsContext)

