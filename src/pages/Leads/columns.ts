import type { Column } from "../../components/Table/Table";
import type { Lead } from "../../models/Leads";

export const leadColumns: Column<Lead>[] = [
    { label: "ID", key: "id" },
    { label: "Score", key: "score" },
    { label: "Name", key: "name" },
    { label: "Company", key: "company" },
    { label: "Email", key: "email" },
    { label: "Source", key: "source" },
    { label: "Status", key: "status" },
  ];