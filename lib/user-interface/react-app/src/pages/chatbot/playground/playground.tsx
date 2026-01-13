import BaseAppLayout from "../../../components/base-app-layout";

import { Link, useParams } from "react-router-dom";
import { Container, Header, HelpPanel } from "@cloudscape-design/components";
import Chat from "../../../components/chatbot/chat";
import { ChatLayout } from "../../../components/chatbot/types";

export default function Playground(props: { chatLayout?: ChatLayout }) {
  const { sessionId, applicationId } = useParams();

  return (
    <BaseAppLayout
      info={
        <HelpPanel header={<Header variant="h3">שימוש בצ'אט</Header>}>
          <p>
            מגרש המשחקים של הצ'אט מאפשר למשתמשים לתקשר עם מודל שפה נבחר (LLM)
            ועם רכיב אחזור מידע (RAG) אופציונלי. ניתן ליצור מרחבי עבודה חדשים
            ל-RAG דרך <Link to="/rag/workspaces">מרחבי עבודה</Link> בקונסולה.
          </p>
          <h3>הגדרות</h3>
          <p>
            ניתן להגדיר הגדרות נוספות עבור מודל השפה דרך פעולת ההגדרות בפינה
            הימנית-תחתונה. ניתן לשנות את ערכי ה-Temperature וה-Top P שישמשו
            ליצירת התשובות. כמו כן, ניתן להפעיל ולכבות את מצב הזרמה עבור מודלים
            שתומכים בכך (ההגדרה מתעלמת אם המודל אינו תומך בהזרמה). הפעלת
            מטא-דאטה מציגה מידע נוסף על התשובה, כגון הפקודות המשמשות לתקשורת עם
            המודל והקטעים מהמסמכים שנשלפו ממאגר ה-RAG.
          </p>
          <h3>צ'אט מולטימודלי</h3>
          <p>
            אם תבחרו מודל מולטימודלי (כמו Anthropic Claude 3), תוכלו להעלות
            תמונות לשימוש בשיחה.
          </p>
          <h3>היסטוריית שיחות</h3>
          <p>
            כל השיחות נשמרות וניתן לגשת אליהן מאוחר יותר דרך{" "}
            <Link to="/chatbot/sessions">היסטוריית שיחות</Link> בסרגל הניווט.
          </p>
        </HelpPanel>
      }
      toolsWidth={300}
      content={
        <Container data-locator="chatbot-ai-container">
          <Chat
            chatLayout={props.chatLayout}
            applicationId={applicationId}
            sessionId={sessionId}
          />
        </Container>
      }
    />
  );
}
