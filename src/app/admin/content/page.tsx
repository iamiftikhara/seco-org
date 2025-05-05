'use client';

import { useState } from 'react';

export default function ContentManagement() {
  const [formData, setFormData] = useState({
    heroTitle: '',
    heroSubtitle: '',
    heroImage: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/update-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        alert('Content updated successfully!');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to update content');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Content Management</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Hero Section</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2">Title</label>
            <input
              type="text"
              value={formData.heroTitle}
              onChange={(e) => setFormData({...formData, heroTitle: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-2">Subtitle</label>
            <input
              type="text"
              value={formData.heroSubtitle}
              onChange={(e) => setFormData({...formData, heroSubtitle: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-2">Background Image URL</label>
            <input
              type="text"
              value={formData.heroImage}
              onChange={(e) => setFormData({...formData, heroImage: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}