import { TableProps } from "@cloudscape-design/components";
import { Model } from "../../../API";

export const ModelsColumnDefinitions: TableProps.ColumnDefinition<Model>[] = [
  {
    id: "provider",
    header: "ספק",
    sortingField: "provider",
    cell: (item: Model) => item.provider,
  },
  {
    id: "name",
    header: "שם",
    sortingField: "name",
    cell: (item: Model) => item.name,
    isRowHeader: true,
  },
  {
    id: "ragSupported",
    header: "תומך RAG",
    sortingField: "ragSupported",
    cell: (item: Model) => (item.ragSupported ? "Yes" : "No"),
  },
  {
    id: "inputModalities",
    header: "דרכי קלט",
    sortingField: "inputModalities",
    cell: (item: Model) => item.inputModalities.join(", "),
  },
  {
    id: "outputModalities",
    header: "דרכי פלט",
    sortingField: "outputModalities",
    cell: (item: Model) => item.outputModalities.join(", "),
  },
  {
    id: "streaming",
    header: "הזרמת תשובות",
    sortingField: "streaming",
    cell: (item: Model) => (item.streaming ? "Yes" : "No"),
  },
];
