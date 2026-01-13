import { useParams } from "react-router-dom";
import Chat from "../../components/chatbot/chat";
import styles from "../../styles/chat.module.scss";
import { ChatLayout } from "../../components/chatbot/types";
import Playground from "../chatbot/playground/playground";

export default function ApplicationChat(props: { chatLayout?: ChatLayout }) {
  const { applicationId, sessionId } = useParams();

  return props.chatLayout ? (
    <div data-locator="chatbot-ai-container">
      <Playground chatLayout={props.chatLayout} />
    </div>
  ) : (
    <div
      className={styles.appChatContainer}
      data-locator="chatbot-ai-container"
    >
      <Chat sessionId={sessionId} applicationId={applicationId} />
    </div>
  );
}
