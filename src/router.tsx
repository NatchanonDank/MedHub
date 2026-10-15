import { createBrowserRouter, Outlet, NavLink } from 'react-router';
import { MedListPage } from './pages/MedListPage';
import { MedDetailPage } from './pages/MedDetailPage';
import { MyKitPage } from './pages/MyKitPage';
import { AboutPage } from './pages/AboutPage';
import { InteractionCheckerPage } from './pages/InteractionCheckerPage';

const MainLayout = () => {
  const navClass = ({ isActive }: { isActive: boolean }) => 
    `btn btn-ghost ${isActive ? 'text-primary border-b-2 border-primary rounded-none font-bold' : ''}`;

  return (
    <div className="min-h-screen bg-base-200 font-sans flex flex-col">
      {/* Navigation Bar */}
      <header className="navbar bg-base-100 shadow-sm px-4 sm:px-6 lg:px-8 sticky top-0 z-50 border-b border-base-200">
        <div className="flex-1">
          <NavLink to="/" className="inline-flex items-center gap-2 text-xl sm:text-2xl font-bold text-primary">
            <img src="/icon.png" alt="MedHub Logo" className="w-7 h-7 object-contain" />
            <span>MedHub</span>
          </NavLink>
        </div>

        {/* เมนูสำหรับหน้าจอ Desktop */}
        <div className="flex-none gap-1 hidden md:flex">
          <NavLink to="/" className={navClass}>หน้าหลัก</NavLink>
          <NavLink to="/checker" className={navClass}>เช็คปฏิกิริยายา</NavLink>
          <NavLink to="/my-kit" className={navClass}>กระเป๋ายา</NavLink>
          <NavLink to="/about" className={navClass}>เกี่ยวกับเรา</NavLink>
        </div>

        {/* เมนูสำหรับมือถือ */}
        <div className="flex-none md:hidden dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-square">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 border border-base-200">
            <li><NavLink to="/">หน้าหลัก</NavLink></li>
            <li><NavLink to="/checker">เช็คปฏิกิริยายา</NavLink></li>
            <li><NavLink to="/my-kit">กระเป๋ายา</NavLink></li>
            <li><NavLink to="/about">เกี่ยวกับเรา</NavLink></li>
          </ul>
        </div>
      </header>
      
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="footer footer-center p-6 bg-base-100 text-base-content/70 border-t border-base-200 text-xs sm:text-sm mt-auto">
        <div className="space-y-1">
          <p>© 2026 MedHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <MedListPage /> },
      { path: 'med/:id', element: <MedDetailPage /> },
      { path: 'checker', element: <InteractionCheckerPage /> },
      { path: 'my-kit', element: <MyKitPage /> },
      { path: 'about', element: <AboutPage /> },
    ],
  },
]);