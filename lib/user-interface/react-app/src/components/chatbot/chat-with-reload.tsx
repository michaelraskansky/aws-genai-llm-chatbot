import { Button } from "@cloudscape-design/components";
import Chat from "./chat";
import { useState } from "react";
import styles from "../../styles/chat.module.scss";

export default function ChatWithReload(props: { sessionId?: string }) {
  const [key, setKey] = useState(0);

  const reloadChat = () => {
    setKey((prev) => prev + 1);
  };

  return (
    <>
      <Chat key={key} sessionId={props.sessionId} />
      <div className={styles.input_container}>
        <Button variant="primary" onClick={reloadChat} iconName="refresh">
          שיחה חדשה
        </Button>
        {/* Other ChatInputPanel content */}
      </div>
    </>
  );
}
