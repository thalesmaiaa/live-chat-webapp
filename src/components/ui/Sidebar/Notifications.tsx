import * as React from 'react';

import { useNotificationSocket } from '@/hooks';
import { extractCookie } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import { useUserStore } from '@/stores';
import { toast } from 'sonner';
import { ReceivedWebSocketMessage, UserNotification } from '@/@types';

export function Notifications() {
  const { userData, setNotifications, notifications } = useUserStore();
  const { push } = useRouter();
  const pathname = usePathname();

  const { connectSocket, disconnectSocket } = useNotificationSocket();

  const authToken = extractCookie('authToken') || '';

  const handleNotificationRedirect = React.useCallback(
    (message: ReceivedWebSocketMessage) => {
      if (message.notificationType === 'NEW_MESSAGE') {
        push(`/chats/${message.destinationId}`);
        return;
      }

      push('/notifications');
    },
    [push],
  );

  const processNotification = React.useCallback(
    (message: ReceivedWebSocketMessage) => {
      const { message: receivedMessage } = message as { message: string };

      const isChatDestinationOpened = pathname.includes(message.destinationId as string);
      if (!isChatDestinationOpened) {
        toast.info(`${receivedMessage}`, {
          duration: 5000,
          action: {
            label: 'View',
            onClick: () => handleNotificationRedirect(message),
          },
        });
      }

      const updatedNotifications = [
        ...(notifications || []),
        message.notificationType,
      ] as UserNotification[];
      setNotifications(updatedNotifications);
    },
    [pathname, notifications, setNotifications, handleNotificationRedirect],
  );

  React.useEffect(() => {
    if (!authToken || !userData?.id) return;
    connectSocket({
      authToken,
      subscribeUrl: `/topics/notifications/${userData.id}`,
      onSubscribe: processNotification,
    });

    return () => {
      disconnectSocket();
    };
  }, [authToken, connectSocket, disconnectSocket, userData?.id, processNotification]);

  return null;
}
