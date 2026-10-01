import React from "react";
import { CopilotChatWindow } from "../components/copilot/CopilotChatWindow.js";

export const CopilotPage: React.FC = () => {
  return (
    <div className="space-y-4">
      <CopilotChatWindow />
    </div>
  );
};
