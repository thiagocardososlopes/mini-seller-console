import { useContext } from "react";
import { DataContext } from "../../context/DataContext/context";

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useDataContext must be used inside DataProvider");
  }
  return context;
};