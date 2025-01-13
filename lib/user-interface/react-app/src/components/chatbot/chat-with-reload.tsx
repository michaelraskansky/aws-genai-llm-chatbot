import { Button } from "@cloudscape-design/components";
import Chat from "./chat";
import { useState } from "react";

export default function ChatWithReload(props: { sessionId?: string }) {
  const [key, setKey] = useState(0);

  const reloadChat = () => {
    setKey((prev) => prev + 1);
  };

  return (
    <>
      <Chat key={key} sessionId={props.sessionId} />
      <Button onClick={reloadChat}>שיחה חדשה</Button>
    </>
  );
}
