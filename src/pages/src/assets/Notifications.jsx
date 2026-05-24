import Sidebar from '../components/Sidebar';

export default function Notifications() {
  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#F7F9FC' }}>
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold" style={{ color: '#1B4F6B' }}>Notifications clients</h1>
      </div>
    </div>
  );
}