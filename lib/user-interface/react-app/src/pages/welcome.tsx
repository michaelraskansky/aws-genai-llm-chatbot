import {
  ContentLayout,
  Header,
  Cards,
  Container,
  SpaceBetween,
  Link,
  BreadcrumbGroup,
} from "@cloudscape-design/components";
import BaseAppLayout from "../components/base-app-layout";
import RouterButton from "../components/wrappers/router-button";
import useOnFollow from "../common/hooks/use-on-follow";
import { CHATBOT_NAME } from "../common/constants";

export default function Welcome() {
  const onFollow = useOnFollow();

  return (
    <BaseAppLayout
      breadcrumbs={
        <BreadcrumbGroup
          onFollow={onFollow}
          items={[
            {
              text: CHATBOT_NAME,
              href: "/",
            },
          ]}
        />
      }
      content={
        <ContentLayout
          header={
            <Header
              variant="h1"
              data-locator="welcome-header"
              description="פתרון פתוח, מודולרי ומקיף לפריסה של צ'אטבוט רב-מודל ורב-RAG באמצעות AWS CDK ב-AWS."
              actions={
                <RouterButton
                  iconAlign="right"
                  iconName="contact"
                  variant="primary"
                  href="/chatbot/playground"
                >
                  התחלת עבודה
                </RouterButton>
              }
            >
              אודות הצ'אטבוט
            </Header>
          }
        >
          <SpaceBetween size="l">
            <Cards
              cardDefinition={{
                header: (item) => (
                  <Link
                    external={item.external}
                    href={item.href}
                    fontSize="heading-m"
                  >
                    {item.name}
                  </Link>
                ),
                sections: [
                  {
                    content: (item) => (
                      <div>
                        <img
                          src={item.img}
                          alt="Placeholder"
                          style={{ width: "100%" }}
                        />
                      </div>
                    ),
                  },
                  {
                    content: (item) => (
                      <div>
                        <div>{item.description}</div>
                      </div>
                    ),
                  },
                  {
                    id: "type",
                    header: "סוג",
                    content: (item) => item.type,
                  },
                ],
              }}
              cardsPerRow={[{ cards: 1 }, { minWidth: 700, cards: 3 }]}
              items={[
                {
                  name: "Amazon Bedrock",
                  external: true,
                  type: "AWS ניהול מלא",
                  href: "https://aws.amazon.com/bedrock/",
                  img: "/images/welcome/amazon-bedrock.png",
                  description:
                    "Amazon Bedrock הוא שירות מנוהל מלא שמספק מודלים מבוססי תשתית (FMs) מאמזון וחברות סטארט-אפ מובילות בתחום ה-AI, דרך ממשק API.",
                },
                {
                  name: "Amazon SageMaker",
                  external: true,
                  type: "AWS אחסון עצמי",
                  href: "https://aws.amazon.com/sagemaker/",
                  img: "/images/welcome/self-hosted.jpg",
                  description:
                    "מבנה CDK לפריסת והרצת מודלים באחסון עצמי על Amazon SageMaker. פריסת מודלים מוכנים מראש מ-SageMaker Foundation/Jumpstart ו-HuggingFace.",
                },
                {
                  name: "מודלים מצד שלישי",
                  type: "ממשק API חיצוני",
                  href: "#",
                  img: "/images/welcome/3p.png",
                  description:
                    "ממשק עם מודלים מצד שלישי באמצעות API. כגון AI21 Labs, OpenAI, HuggingFace ועוד.",
                },
              ]}
            />
            <Container
              media={{
                content: (
                  <img src="/images/welcome/ui-dark.png" alt="placeholder" />
                ),
                width: 300,
                position: "side",
              }}
            >
              <Header
                variant="h1"
                description="מבנה CDK זמין לפריסה של אפליקציית ווב מבוססת React."
              >
                ממשק משתמש מלא
              </Header>
              <p>
                האפליקציה מאוחסנת ב-
                <Link external href="https://aws.amazon.com/s3/">
                  Amazon S3
                </Link>{" "}
                מאחורי{" "}
                <Link external href="https://aws.amazon.com/cloudfront/">
                  Amazon CloudFront
                </Link>{" "}
                עם{" "}
                <Link external href="https://aws.amazon.com/cognito/">
                  הזדהות דרך Cognito
                </Link>{" "}
                על מנת לאפשר לך לתקשר ולהתנסות עם <strong>מודלים מרובים</strong>
                , <strong>מקורות RAG מרובים</strong>,{" "}
                <strong>תמיכה בהיסטוריית שיחות</strong> ו-{" "}
                <strong>העלאת מסמכים</strong>.
              </p>
              <p>
                שכבת הממשק בין ה-UI וה-backend נבנית על בסיס{" "}
                <Link
                  external
                  href="https://docs.aws.amazon.com/appsync/latest/devguide/aws-appsync-real-time-data.html"
                >
                  מנויים של Amazon AppSync.
                </Link>
                <p>
                  רכיבי ה-UI מסופקים על ידי{" "}
                  <Link external href="https://cloudscape.design/">
                    מערכת עיצוב Cloudscape של AWS
                  </Link>
                </p>
              </p>
            </Container>
            <Container
              media={{
                content: (
                  <img src="/images/welcome/chat-modes.png" alt="placeholder" />
                ),
                width: 300,
                position: "side",
              }}
            >
              <Header variant="h1">יכולות</Header>
              <Header variant="h3">שיחה רב-מודלית</Header>
              <p>
                אתה יכול <Link href="/chatbot/playground">לשוחח</Link> עם טקסט
                או להעלות תמונות ולהשתמש בשיחות רב-מודליות. כעת אנו תומכים
                ביכולות רב-מודליות עם Anthropic Claude 3 דרך Amazon Bedrock
                ו-Idefics המופעלים דרך SageMaker.
              </p>
              <h3>השוואת מודלים ומקורות RAG מרובים</h3>
              <p>
                ב-{" "}
                <Link href="/chatbot/playground">מגרש המשחקים הרב-שיחתי</Link>{" "}
                ניתן להשתמש במודלים ובמקורות RAG מרובים בו זמנית ולהשוות ביניהם.
              </p>
              <h3>בדיקת מקורות RAG, embeddings ו-cross-encoders</h3>
              <p>
                אנו מספקים ממשק קל לשימוש לבדיקת חיפוש במקור נתונים של RAG,
                embeddings של טקסט ודירוג של cross-encoders.
              </p>
            </Container>
            <Header
              variant="h1"
              description="תוכל להתנסות באחת או יותר מהבניינים הבאים של CDK כדי ליישם בקשות RAG."
            >
              מקורות של Generation Augmented Generation (RAG)
            </Header>
            <Cards
              cardDefinition={{
                header: (item) => (
                  <Link
                    href={item.href}
                    external={item.external}
                    fontSize="heading-m"
                  >
                    {item.name}
                  </Link>
                ),
                sections: [
                  {
                    content: (item) => <div>{item.description}</div>,
                  },
                  {
                    id: "type",
                    header: "סוג",
                    content: (item) => item.type,
                  },
                ],
              }}
              cardsPerRow={[{ cards: 1 }, { minWidth: 700, cards: 3 }]}
              items={[
                {
                  name: "Amazon Aurora עם pgvector",
                  type: "בסיס נתונים וקטורי",
                  external: true,
                  href: "https://aws.amazon.com/about-aws/whats-new/2023/07/amazon-aurora-postgresql-pgvector-vector-storage-similarity-search/",
                  description:
                    "מהדורת Amazon Aurora PostgreSQL-Compatible תומכת כעת בהרחבת pgvector לאחסון embeddings ממודלים של למידת מכונה (ML) בבסיס הנתונים שלך ולביצוע חיפושי דמיון יעילים.",
                  tags: ["ניהול מלא"],
                },
                {
                  name: "Amazon Opensearch VectorSearch",
                  type: "בסיס נתונים וקטורי",
                  external: true,
                  href: "https://aws.amazon.com/blogs/big-data/amazon-opensearch-services-vector-database-capabilities-explained/",
                  description:
                    "עם היכולות של בסיס הנתונים הווקטורי של OpenSearch Service, תוכל ליישם חיפוש סמנטי, Generation Augmented Generation (RAG) עם LLMs, מנועי המלצה וחיפוש מדיה עשירה.",
                },

                {
                  name: "מאגרי ידע של Amazon Bedrock",
                  external: true,
                  type: "מנוע חיפוש",
                  href: "https://aws.amazon.com/bedrock/knowledge-bases/",
                  description:
                    "עם מאגרי הידע של Amazon Bedrock, תוכל לספק למודלים בסיסיים ולסוכנים מידע הקשרי ממקורות הנתונים הפרטיים של החברה שלך עבור Generation Augmented Generation (RAG) כדי לספק תשובות יותר רלוונטיות, מדויקות ומותאמות אישית.",
                },
                {
                  name: "Amazon Kendra",
                  external: true,
                  type: "מנוע חיפוש",
                  href: "https://aws.amazon.com/kendra/",
                  description:
                    "Amazon Kendra הוא שירות חיפוש חכם המופעל על ידי למידת מכונה (ML).",
                },
              ]}
            />
          </SpaceBetween>
        </ContentLayout>
      }
    ></BaseAppLayout>
  );
}
