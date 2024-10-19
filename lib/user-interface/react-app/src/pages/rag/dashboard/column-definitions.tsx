import { StatusIndicator, TableProps } from "@cloudscape-design/components";
import {
  PropertyFilterProperty,
  PropertyFilterOperator,
} from "@cloudscape-design/collection-hooks";
import { Labels } from "../../../common/constants";
import { DateTime } from "luxon";
import RouterLink from "../../../components/wrappers/router-link";
import { Workspace } from "../../../API";

export const WorkspacesColumnDefinitions: TableProps.ColumnDefinition<Workspace>[] =
  [
    {
      id: "name",
      header: "שם",
      sortingField: "name",
      cell: (item: Workspace) => (
        <RouterLink href={`/rag/workspaces/${item.id}`}>{item.name}</RouterLink>
      ),
      isRowHeader: true,
    },
    {
      id: "engine",
      header: "מנוע",
      sortingField: "engine",
      cell: (item: Workspace) => Labels.engineMap[item.engine],
    },
    {
      id: "starus",
      header: "סטאטוס",
      sortingField: "status",
      cell: (item) => (
        <StatusIndicator type={Labels.statusTypeMap[item.status!]}>
          {Labels.statusMap[item.status!]}
        </StatusIndicator>
      ),
      minWidth: 120,
    },
    {
      id: "documents",
      header: "מסמכים",
      sortingField: "documents",
      cell: (item: Workspace) => item.documents,
    },
    {
      id: "timestamp",
      header: "תאריך יצירה",
      sortingField: "timestamp",
      cell: (item: Workspace) =>
        DateTime.fromISO(new Date(item.createdAt).toISOString()).toLocaleString(
          DateTime.DATETIME_SHORT
        ),
      sortingComparator(a, b) {
        return a.createdAt.localeCompare(b.createdAt);
      },
    },
  ];

export const WorkspaceColumnFilteringProperties: PropertyFilterProperty[] = [
  {
    propertyLabel: "שם",
    key: "name",
    groupValuesLabel: "Name values",
    operators: [":", "!:", "=", "!="] as PropertyFilterOperator[],
  },
  {
    propertyLabel: "מנוע",
    key: "engine",
    groupValuesLabel: "Engine values",
    operators: [":", "!:", "=", "!="] as PropertyFilterOperator[],
  },
  {
    propertyLabel: "סטאטוס",
    key: "status",
    groupValuesLabel: "Status values",
    operators: [":", "!:", "=", "!="] as PropertyFilterOperator[],
  },
  {
    propertyLabel: "מסמכים",
    key: "documents",
    groupValuesLabel: "Documents",
    defaultOperator: ">" as PropertyFilterOperator,
    operators: ["<", "<=", ">", ">="] as PropertyFilterOperator[],
  },
].sort((a, b) => a.propertyLabel.localeCompare(b.propertyLabel));
