export default function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Content Stats</h3>
          <p className="text-gray-600">Total Pages: 5</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Recent Updates</h3>
          <p className="text-gray-600">Last updated: 2 hours ago</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Quick Actions</h3>
          <button className="text-blue-500 hover:underline">Edit Homepage</button>
        </div>
      </div>
    </div>
  );
}