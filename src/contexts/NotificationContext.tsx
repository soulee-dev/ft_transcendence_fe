import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

type NotificationMessage = {
  type: string;
  [key: string]: any;
};

type NotificationContextType = {
  dispatchNotificationEvent: (message: NotificationMessage) => void;
  registerNotificationEventHandler: (
    handler: (message: NotificationMessage) => void
  ) => void;
  unregisterNotificationEventHandler: (
    handler: (message: NotificationMessage) => void
  ) => void;
};

const NotificationContext = createContext<NotificationContextType>({
  dispatchNotificationEvent: () => {},
  registerNotificationEventHandler: () => {},
  unregisterNotificationEventHandler: () => {},
});

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [eventHandlers, setEventHandlers] = useState<
    ((message: NotificationMessage) => void)[]
  >([]);

  const dispatchNotificationEvent = useCallback(
    (message: NotificationMessage) => {
      eventHandlers.forEach((handler) => handler(message));
    },
    [eventHandlers]
  );

  const registerNotificationEventHandler = useCallback(
    (handler: (message: NotificationMessage) => void) => {
      setEventHandlers((prevHandlers) => [...prevHandlers, handler]);
    },
    []
  );

  const unregisterNotificationEventHandler = useCallback(
    (handler: (message: NotificationMessage) => void) => {
      setEventHandlers((prevHandlers) =>
        prevHandlers.filter((h) => h !== handler)
      );
    },
    []
  );

  return (
    <NotificationContext.Provider
      value={{
        dispatchNotificationEvent,
        registerNotificationEventHandler,
        unregisterNotificationEventHandler,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
