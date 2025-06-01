import { useUserStore } from '@/stores';
import { usePathname, useRouter } from 'next/navigation';
import { Notifications } from './Notifications';

export function Sidebar() {
  const { push } = useRouter();
  const pathname = usePathname();
  const { userData, clearUserData } = useUserStore();

  const paths = {
    home: '/',
    myChats: `/${userData?.id}/chats`,
    notifications: '/notifications',
  };

  const redirects = {
    home: () => push(paths.home),
    myChats: () => push(paths.myChats),
    createGroupChat: () => push(paths.notifications),
  };

  function isPathSelected(path: string) {
    return pathname === path;
  }

  const getButtonClass = (path: string) =>
    `hover:text-blue-600 px-3 py-2 rounded text-left ${
      isPathSelected(path) ? 'bg-blue-100 font-semibold text-blue-700' : ''
    }`;

  function logout() {
    clearUserData();
    push('/login');
    localStorage.removeItem('authToken');
    localStorage.removeItem('user-storage');
    document.cookie = `authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
  }

  return (
    <aside className='w-64 bg-white border-r border-gray-200 p-6 flex flex-col gap-6 h-screen'>
      <div>
        <h2 className='text-xl font-semibold mb-4'>Sidebar</h2>

        <nav className='flex flex-col gap-3 text-gray-700 flex-grow'>
          <button className={getButtonClass(paths.home)} onClick={redirects.home}>
            My Contacts
          </button>
          <button className={getButtonClass(paths.myChats)} onClick={redirects.myChats}>
            My chats
          </button>
          <button
            className={getButtonClass(paths.notifications)}
            onClick={redirects.createGroupChat}
          >
            Notifications
          </button>
        </nav>
      </div>

      <footer className='mt-auto flex flex-col gap-2'>
        <Notifications />

        <button
          className='w-full px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded'
          onClick={logout}
        >
          Logout
        </button>
      </footer>
    </aside>
  );
}
