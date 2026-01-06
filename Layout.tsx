import React, { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100 max-w-md mx-auto shadow-2xl overflow-hidden relative flex flex-col">
      {/* Max-w-md simulates a mobile container on desktop, fits 100% on mobile */}
      {children}
    </div>
  );
};

export default Layout;
