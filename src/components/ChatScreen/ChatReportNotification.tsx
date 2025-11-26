import React from "react";

interface ChatReportNotificationProps {
  onShowReport: () => void;
  userName: string;
}

const ChatReportNotification: React.FC<ChatReportNotificationProps> = ({
  onShowReport,
  userName,
}) => (
  <div className="w-full flex justify-center items-center py-4">
    <button
      className="px-6 py-3 geist-mono bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition-all duration-300 ease-out hover:scale-105 active:scale-95 shadow-lg shadow-rose-500/10"
      onClick={onShowReport}
    >
      {`View ${userName}'s Wellbeing Report`}
    </button>
  </div>
);

export default ChatReportNotification;
