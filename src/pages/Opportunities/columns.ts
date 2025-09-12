import type { Column } from "../../components/Table/Table";
import type { Opportunity } from "../../models/Opportunity";

export const opportunitiesColumns: Column<Opportunity>[] = [
    { label: "ID", key: "id" },
    { label: "Name", key: "name" },
    { label: "Account Name", key: "accountName" },
    { label: "Amount", key: "amount", type: "money" },
    { label: "Stage", key: "stage" },
  ];