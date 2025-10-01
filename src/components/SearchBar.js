import React, { useState } from "react";

function SearchBar() {
  const [q, setQ] = useState("");

  function submit(e) {
    e.preventDefault();
    // Placeholder behaviour: log query. Later we'll call an API or navigate to a search results page.
    console.log("Search for:", q);
    alert(`Searching for: ${q || "nearby services"}`);
  }

  return (
    <form className="search-wrap" onSubmit={submit}>
      <input
        className="search-input"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Find a waasha near you..."
        aria-label="Search"
      />
      <button className="btn small" type="submit">SEARCH</button>
    </form>
  );
}

export default SearchBar;
