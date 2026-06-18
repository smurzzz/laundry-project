import Sidebar from './Sidebar';
import FooterMenu from './FooterMenu';

const DashboardLayout = ({ children }) => {
  return (
    <>
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <Sidebar />
        <div className="space-y-6 pb-24 lg:pb-0">{children}</div>
      </div>
      <FooterMenu />
    </>
  );
};

export default DashboardLayout;

