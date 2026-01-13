import {
  SideNavigation,
  SideNavigationProps,
} from "@cloudscape-design/components";
import useOnFollow from "../common/hooks/use-on-follow";
import { useNavigationPanelState } from "../common/hooks/use-navigation-panel-state";
import { AppContext } from "../common/app-context";
import { useContext, useState } from "react";
import { CHATBOT_NAME } from "../common/constants";
import { UserContext } from "../common/user-context";
import { UserRole } from "../common/types";
import { useParams } from "react-router-dom";

export default function NavigationPanel() {
  const appContext = useContext(AppContext);
  const userContext = useContext(UserContext);
  const onFollow = useOnFollow();
  const { applicationId } = useParams();
  const [navigationPanelState, setNavigationPanelState] =
    useNavigationPanelState();
  const [items] = useState<SideNavigationProps.Item[]>(() => {
    const items: SideNavigationProps.Item[] = [];

    if (
      applicationId &&
      userContext.userRoles.includes(UserRole.USER) &&
      !userContext.userRoles.includes(UserRole.ADMIN) &&
      !userContext.userRoles.includes(UserRole.WORKSPACE_MANAGER)
    ) {
      const constBasicUserRoutes: SideNavigationProps.Item[] = [
        {
          type: "link",
          text: "צ׳אטבוט",
          href: `/chat/application/${applicationId}`,
        },
        {
          type: "link",
          text: "הסטוריה",
          href: `/chat/application/${applicationId}/sessions`,
        },
      ];
      items.push(...constBasicUserRoutes);
    }

    if (
      userContext.userRoles.includes(UserRole.ADMIN) ||
      userContext.userRoles.includes(UserRole.WORKSPACE_MANAGER)
    ) {
      const adminAndWorkspaceManagerItems: SideNavigationProps.Item[] = [
        { type: "link", text: "צ׳אטבוט", href: "/chatbot/playground" },
        {
          type: "link",
          text: "הסטוריה",
          href: "/chatbot/sessions",
        },
        {
          type: "link",
          text: "אודות",
          href: "/about",
        },
        {
          type: "section",
          text: "מתקדם",
          items: [
            {
              type: "link",
              text: "השוואת מודלים",
              href: "/chatbot/multichat",
            },

            {
              type: "link",
              text: "מודלים",
              href: "/chatbot/models",
            },
          ],
        },
      ];
      items.push(...adminAndWorkspaceManagerItems);

      if (appContext?.config.rag_enabled) {
        const crossEncodersItems: SideNavigationProps.Item[] = appContext
          ?.config.cross_encoders_enabled
          ? [
              {
                type: "link",
                text: "מקודדים",
                href: "/rag/cross-encoders",
              },
            ]
          : [];

        items.push({
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
    }

    if (userContext.userRoles.includes(UserRole.ADMIN)) {
      items.push({
        type: "section",
        text: "מנהל",
        items: [
          {
            type: "link",
            text: "יישומים",
            href: "/admin/applications",
          },
        ],
      });

      items.push(
        { type: "divider" },
        {
          type: "link",
          text: "תיעוד",
          href: "https://aws-samples.github.io/aws-genai-llm-chatbot/",
          external: true,
        }
      );
    }

    return items;
  });

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
