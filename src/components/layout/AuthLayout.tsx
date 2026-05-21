import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Header from './Header2';

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Minimal top bar — just the logo */}
      <Header />
      {/* Centered content */}
      <div className="">
        <div className="">
          <Outlet />
        </div>
      </div>
    </div>
  );
}