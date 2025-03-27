import React from 'react';

const SearchBar = ({ searchQuery, handleFilter, setSearchQuery, setFilteredData, data, fields }) => {
    return (
        <div className='flex rounded-md'>
            <input
                type="text"
                placeholder="Search Results"
                value={searchQuery}
                onChange={(e) => handleFilter(e, fields, setSearchQuery, setFilteredData, data)}
                className="bg-white px-3 py-1 rounded-md w-52 border border-foreground text-gray-700"
            />
        </div>
    );
};

export default SearchBar;