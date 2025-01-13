import {
  SideNavigation,
  SideNavigationProps,
} from "@cloudscape-design/components";
import useOnFollow from "../common/hooks/use-on-follow";
import { useNavigationPanelState } from "../common/hooks/use-navigation-panel-state";
import { AppContext } from "../common/app-context";
import { useContext, useState, useEffect } from "react";
import { CHATBOT_NAME } from "../common/constants";
import { UserContext } from "../common/user-context";

export default function NavigationPanel() {
  const appContext = useContext(AppContext);
  const userContext = useContext(UserContext);

  const onFollow = useOnFollow();
  const [navigationPanelState, setNavigationPanelState] =
    useNavigationPanelState();

  const [items, setItems] = useState<SideNavigationProps.Item[]>([]); // State for navigation items

  // Update navigation items when hasRagAccess or appContext changes
  useEffect(() => {
    const generateItems = () => {
      const newItems: SideNavigationProps.Item[] = [
        { type: "link", text: "צ׳אטבוט", href: "/chatbot/playground" },
        {
          type: "link",
          text: "היסטוריה",
          href: "/chatbot/sessions",
        },
        {
          type: "link",
          text: "אודות",
          href: "/about",
        },
      ];

      if (userContext?.isAdmin) {
        newItems.push({
          type: "section",
          text: "אפשרויות מתקדמות",
          items: [
            {
              type: "link",
              text: "מודלים",
              href: "/chatbot/models",
            },
            {
              type: "link",
              text: "השוואת מודלים",
              href: "/chatbot/multichat",
            },
          ],
        });
      }

      if (appContext?.config.rag_enabled && userContext?.isAdmin) {
        const crossEncodersItems: SideNavigationProps.Item[] = appContext
          ?.config.cross_encoders_enabled
          ? [
              {
                type: "link",
                text: "Cross-encoders",
                href: "/rag/cross-encoders",
              },
            ]
          : [];

        newItems.push({
          type: "section",
          text: "יצירה מעושרת נתונים (RAG)",
          items: [
            {
              type: "link",
              text: "לוח בקרה",
              href: "/rag",
            },
            {
              type: "link",
              text: "חיפוש סמנטי",
              href: "/rag/semantic-search",
            },
            {
              type: "link",
              text: "סביבות עבודה",
              href: "/rag/workspaces",
            },
            {
              type: "link",
              text: "הטבעות (Embeddings)",
              href: "/rag/embeddings",
            },
            ...crossEncodersItems,
            { type: "link", text: "מנועי RAG", href: "/rag/engines" },
          ],
        });
      }

      newItems.push(
        { type: "divider" },
        {
          type: "link",
          text: "דוקומנטציה",
          href: "https://aws-samples.github.io/aws-genai-llm-chatbot/",
          external: true,
        }
      );

      return newItems;
    };

    setItems(generateItems());
  }, [userContext, appContext]); // Re-run when hasRagAccess or appContext changes

  const onChange = ({
    detail,
  }: {
    detail: SideNavigationProps.ChangeDetail;
  }) => {
    const sectionIndex = items.indexOf(detail.item);
    setNavigationPanelState({
      collapsedSections: {
        ...navigationPanelState.collapsedSections,
        [sectionIndex]: !detail.expanded,
      },
    });
  };

  return (
    <SideNavigation
      onFollow={onFollow}
      onChange={onChange}
      header={{ href: "/", text: CHATBOT_NAME }}
      items={items.map((value, idx) => {
        if (value.type === "section") {
          const collapsed =
            navigationPanelState.collapsedSections?.[idx] === true;
          value.defaultExpanded = !collapsed;
        }

        return value;
      })}
    />
  );
}
