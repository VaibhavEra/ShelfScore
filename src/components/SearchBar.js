import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for your favorite movies..."
        className="w-full bg-gray-800/50 text-white border border-gray-700 rounded-full py-3 px-5 pr-14
          focus:outline-none focus:border-blue-500 transition-colors text-sm placeholder:text-gray-500
          backdrop-blur-sm"
      />
      <button
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1.5
          rounded-full hover:bg-blue-700 transition-colors font-semibold text-sm"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar; 