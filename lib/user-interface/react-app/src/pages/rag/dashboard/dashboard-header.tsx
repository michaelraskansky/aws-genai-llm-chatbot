import { Header, SpaceBetween } from "@cloudscape-design/components";
import RouterButton from "../../../components/wrappers/router-button";
import RouterButtonDropdown from "../../../components/wrappers/router-button-dropdown";

export default function DashboardHeader() {
  return (
    <Header
      variant="h1"
      actions={
        <SpaceBetween direction="horizontal" size="xs">
          <RouterButton href="/rag/semantic-search">חיפוש סמנטי</RouterButton>
          <RouterButtonDropdown
            items={[
              {
                id: "upload-file",
                text: "העלה קובץ",
                href: "/rag/workspaces/add-data?tab=file",
              },
              {
                id: "add-text",
                text: "הוספת טקסט",
                href: "/rag/workspaces/add-data?tab=text",
              },
              {
                id: "add-qna",
                text: "הוסף שאלות ותשובות",
                href: "/rag/workspaces/add-data?tab=qna",
              },
              {
                id: "crawl-website",
                text: "סרוק אתר חיצוני (Webcrawl)",
                href: "/rag/workspaces/add-data?tab=website",
              },
            ]}
          >
            הוסף מידע
          </RouterButtonDropdown>
        </SpaceBetween>
      }
    >
      לוח בקרה
    </Header>
  );
}
