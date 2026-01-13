import {
  Box,
  Header,
  SpaceBetween,
  Table,
  TableProps,
} from "@cloudscape-design/components";
import { useState } from "react";
import { TextHelper } from "../../../common/helpers/text-helper";
import { WorkspacesColumnDefinitions } from "./column-definitions";
import RouterLink from "../../../components/wrappers/router-link";
import RouterButton from "../../../components/wrappers/router-button";
import { Workspace } from "../../../API";

export interface WorkspacesTableProps {
  loading: boolean;
  workspaces: Workspace[];
}

export default function WorkspacesTable(props: WorkspacesTableProps) {
  const [selectedItems, setSelectedItems] = useState<Workspace[]>([]);
  const isOnlyOneSelected = selectedItems.length === 1;

  return (
    <Table
      loading={props.loading}
      loadingText="טוען סביבות עבודה"
      selectionType="single"
      sortingDisabled={true}
      empty={
        <Box margin={{ vertical: "xs" }} textAlign="center" color="inherit">
          <SpaceBetween size="xxs">
            <div>
              <b>אין סביבות עבודה</b>
              <Box variant="p" color="inherit">
                סביבת עבודה זה אוסף של מסמכים
              </Box>
            </div>
            <RouterButton
              href="/rag/workspaces/create"
              data-locator="create-workspace"
            >
              צור סביבת עבודה
            </RouterButton>
          </SpaceBetween>
        </Box>
      }
      columnDefinitions={WorkspacesColumnDefinitions}
      items={props.workspaces.slice(0, 5)}
      selectedItems={selectedItems}
      onSelectionChange={(event: {
        detail: TableProps.SelectionChangeDetail<Workspace>;
      }) => setSelectedItems(event.detail.selectedItems)}
      header={
        <Header
          counter={
            !props.loading
              ? TextHelper.getHeaderCounterText(props.workspaces, selectedItems)
              : undefined
          }
          actions={
            <SpaceBetween direction="horizontal" size="xs">
              <RouterButton
                disabled={!isOnlyOneSelected}
                href={`/rag/workspaces/${
                  selectedItems.length > 0 ? selectedItems[0].id : ""
                }`}
              >
                הצג
              </RouterButton>
              <RouterButton href="/rag/workspaces/create">
                צור סביבת עבודה
              </RouterButton>
            </SpaceBetween>
          }
        >
          סביבות עבודה
        </Header>
      }
      footer={
        <Box textAlign="center">
          <RouterLink href="/rag/workspaces">
            הצג את כל סביבות העבודה
          </RouterLink>
        </Box>
      }
    />
  );
}
