import { createBrowserRouter, Outlet, Link } from 'react-router';
import { MedListPage } from './pages/MedListPage';
import { MedDetailPage } from './pages/MedDetailPage';
import { InteractionCheckerPage } from './pages/InteractionCheckerPage';
import { MyKitPage } from './pages/MyKitPage';
import { AboutPage } from './pages/AboutPage';
// กำหนดการจับคู่ Path กับ Component โดยมี DaisyUI Navbar ร่วมกันผ่าน Outlet
export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <div className="min-h-screen bg-base-200">
        {/* Navigation Bar ด้านบนสไตล์ MedHub */}
        <header className="navbar bg-base-100 shadow-md px-6 border-b border-base-300">
          <div className="flex-1">
            <Link to="/" className="btn btn-ghost text-xl text-primary font-bold">
              MedHub
            </Link>
          </div>
          <div className="flex-none gap-2">
            <ul className="menu menu-horizontal px-1 font-medium">
              <li><Link to="/">หน้าหลัก</Link></li>
              <li><Link to="/interaction-checker">เช็คปฏิกิริยาระยา</Link></li>
              <li><Link to="/bookmarks">กระเป๋ายา</Link></li>
              <li><Link to="/about">เกี่ยวกับเรา</Link></li>
            </ul>
          </div>
        </header>

        {/* พื้นที่แสดงผลเนื้อหาแต่ละหน้า */}
        <main className="container mx-auto px-4 py-6">
          <Outlet />
        </main>
      </div>
    ),
    children: [
      { index: true, element: <MedListPage /> },
      { path: 'med/:id', element: <MedDetailPage /> },
      { path: 'interaction-checker', element: <InteractionCheckerPage /> },
      { path: 'my-kit', element: <MyKitPage /> },
      { path: 'bookmarks', element: <MyKitPage /> },
      { path: 'about', element: <AboutPage /> },
    ],
  },
]);