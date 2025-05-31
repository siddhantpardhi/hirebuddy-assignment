import { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("")
  const [location, setLocation] = useState("")
  const [source, setSource] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ query, location, source })
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto p-4 flex flex-col sm:flex-row gap-4">
      <input
        type="text"
        placeholder="Search job role..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-1 px-4 py-2 border rounded-md focus:outline-none"
      />

      <select
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="px-4 py-2 border rounded-md"
      >
        <option value="">Location</option>
        <option value="Remote">Remote</option>
        <option value="New York">New York</option>
        <option value="San Francisco">San Francisco</option>
        {/* Add more as needed */}
      </select>

      <select
        value={source}
        onChange={(e) => setSource(e.target.value)}
        className="px-4 py-2 border rounded-md"
      >
        <option value="">Source</option>
        <option value="linkedin">LinkedIn</option>
        <option value="indeed">Indeed</option>
        <option value="monster">Monster</option>
        {/* Add more as needed */}
      </select>

      <button
        type="submit"
        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
      >
        Search
      </button>
    </form>
  );
}
