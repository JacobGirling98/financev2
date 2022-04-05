import React from "react";
import { useContext } from "react";
import { useState } from "react";
import { DescriptionMapping } from "../types/types";

interface IFormOptionsContext {
  descriptions: string[];
  setDescriptions: (descriptions: string[]) => void;
  descriptionMappings: DescriptionMapping[];
  setDescriptionMappings: (mappings: DescriptionMapping[]) => void;
}

const defaultState: IFormOptionsContext = {
  descriptions: [],
  setDescriptions: (descriptions: string[]) => {},
  descriptionMappings: [],
  setDescriptionMappings: (mappings: DescriptionMapping[]) => {}
}

const FormOptionsContext = React.createContext<IFormOptionsContext>(defaultState);

export const FormOptionsProvider: React.FC = ({ children }) => {
  const [descriptions, setDescriptions] = useState<string[]>([]);
  const [descriptionMappings, setDescriptionMappings] = useState<DescriptionMapping[]>([]);

  return (
    <FormOptionsContext.Provider value={{ descriptions, setDescriptions, descriptionMappings, setDescriptionMappings }}>
      {children}
    </FormOptionsContext.Provider>
  )
}

export const useFormOptionsContext = () => useContext(FormOptionsContext)

