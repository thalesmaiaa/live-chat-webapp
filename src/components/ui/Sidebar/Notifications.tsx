import * as React from 'react';

import { useNotificationSocket } from '@/hooks';
import { extractCookie } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/stores';
import { toast } from 'sonner';
import { UserNotification } from '@/stores/userStore';

export function Notifications() {
  const { userData, setNotifications, notifications } = useUserStore();
  const { push } = useRouter();

  const { connectSocket, disconnectSocket } = useNotificationSocket();

  const authToken = extractCookie('authToken') || '';

  React.useEffect(() => {
    if (authToken) {
      connectSocket({
        authToken,
        subscribeUrl: `/topics/notifications/${userData?.id}`,
        onSubscribe: (message) => {
          const { message: receivedMessage } = message as {
            message: string;
          };
          toast.info(`New notification: ${receivedMessage}`, {
            duration: 5000,
            action: {
              label: 'View',
              onClick: () => {
                push('/notifications');
              },
            },
          });

          const updatedNotifications = [
            ...(notifications || []),
            'CONTACT_REQUEST',
          ] as UserNotification[];
          setNotifications(updatedNotifications);
        },
      });
    }

    return () => {
      disconnectSocket();
    };
  }, [
    authToken,
    connectSocket,
    disconnectSocket,
    userData?.id,
    push,
    notifications,
    setNotifications,
  ]);

  return null;
}
