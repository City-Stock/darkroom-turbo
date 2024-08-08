"use client";
import { useState } from "react";

type SearchBarProps = {
    onSearch: (query: string) => void;
  };
  
  const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    const [query, setQuery] = useState('');
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSearch(query);
    };
  
    return (
      <form
        onSubmit={handleSubmit}
        className="flex items-center mb-4"
      >
        <input
          type="text"
          placeholder="Search users..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-grow p-2 border rounded-lg mr-2"
        />
        <button className="p-2 px-4 bg-indigo-500 text-white rounded-lg">
          Search
        </button>
      </form>
    );
  };
  
  export default SearchBar;