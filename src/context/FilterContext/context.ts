import { createContext } from "react";
import type { FilterContextType } from "./types";

export const FilterContext = createContext<FilterContextType | undefined>(undefined);
