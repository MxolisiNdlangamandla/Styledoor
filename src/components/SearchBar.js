import React, { useState, useCallback } from "react"; // Import React hooks
import { useNavigate } from "react-router-dom"; // Import useNavigate for programmatic routing
import PropTypes from 'prop-types'; // Import PropTypes for type checking

// SearchBar component for searching services and providers
function SearchBar({ 
  placeholder = "Find a waasha near you...", // Customizable placeholder text
  onSearch, // Optional callback function when search is performed
  className = "search-wrap", // Customizable CSS class
  variant = "default", // Variant for different styling (default, compact, large)
  showButton = true, // Control whether to show search button
  autoFocus = false, // Control whether input should be focused on mount
  maxLength = 100 // Maximum character length for search input
}) {
  const navigate = useNavigate(); // Hook for programmatic navigation
  
  // State for search query
  const [query, setQuery] = useState("");
  // State for loading during search
  const [isSearching, setIsSearching] = useState(false);
  // State for search suggestions/results
  const [suggestions, setSuggestions] = useState([]);
  // State to show/hide suggestions dropdown
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Handle input changes with debouncing for suggestions
  const handleInputChange = useCallback((e) => {
    const value = e.target.value;
    setQuery(value);
    
    // Show suggestions if query is not empty
    if (value.trim()) {
      // Debounce suggestions API call (in real app, you'd call your backend here)
      const timeoutId = setTimeout(() => {
        fetchSuggestions(value);
      }, 300);
      
      // Cleanup timeout on next input
      return () => clearTimeout(timeoutId);
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
    }
  }, []);

  // Fetch search suggestions from backend (placeholder implementation)
  async function fetchSuggestions(searchQuery) {
    try {
      // In production, this would call your backend API
      const mockSuggestions = [
        "Hair styling",
        "Car wash", 
        "Home cleaning",
        "Plumbing services",
        "Beauty services"
      ].filter(item => 
        item.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      setSuggestions(mockSuggestions);
      setShowSuggestions(mockSuggestions.length > 0);
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
      setShowSuggestions(false);
    }
  }

  // Handle form submission
  async function handleSubmit(e) {
    e.preventDefault(); // Prevent default form submission
    
    const searchTerm = query.trim();
    
    // Don't search if query is empty
    if (!searchTerm) {
      return;
    }
    
    setIsSearching(true); // Set loading state
    setShowSuggestions(false); // Hide suggestions
    
    try {
      // Call onSearch callback if provided
      if (onSearch) {
        await onSearch(searchTerm);
      } else {
        // Default behavior: navigate to search results page
        navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
      }
    } catch (error) {
      console.error('Search failed:', error);
      // You could show an error message here
    } finally {
      setIsSearching(false); // Reset loading state
    }
  }

  // Handle suggestion click
  function handleSuggestionClick(suggestion) {
    setQuery(suggestion); // Set the clicked suggestion as query
    setShowSuggestions(false); // Hide suggestions
    // Trigger search with the selected suggestion
    if (onSearch) {
      onSearch(suggestion);
    } else {
      navigate(`/search?q=${encodeURIComponent(suggestion)}`);
    }
  }

  // Handle clicks outside to close suggestions
  function handleBlur() {
    // Delay hiding suggestions to allow for suggestion clicks
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  }

  // Get input styles based on variant
  function getInputStyles() {
    const baseStyles = {
      flex: 1,
      padding: '12px 14px',
      border: '1px solid #e6edf8',
      borderRadius: variant === 'large' ? '12px' : '999px',
      outline: 'none',
      fontSize: variant === 'large' ? '16px' : '14px',
      background: 'white'
    };

    if (variant === 'compact') {
      return { ...baseStyles, padding: '8px 12px', fontSize: '13px' };
    }

    return baseStyles;
  }

  // Renders the search bar component
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* Search form */}
      <form 
        className={className} 
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
          margin: variant === 'compact' ? '4px 0 12px' : '8px 0 18px'
        }}
        role="search" // ARIA role for search form
      >
        {/* Search input */}
        <input
          className="search-input"
          type="search" // Semantic input type for search
          value={query}
          onChange={handleInputChange} // Updates query state and fetches suggestions
          onBlur={handleBlur} // Hide suggestions when input loses focus
          onFocus={() => query.trim() && setShowSuggestions(suggestions.length > 0)} // Show suggestions on focus
          placeholder={placeholder}
          aria-label="Search for services" // Screen reader description
          autoComplete="off" // Disable browser autocomplete
          autoFocus={autoFocus} // Focus input on mount if specified
          maxLength={maxLength} // Limit input length
          disabled={isSearching} // Disable input during search
          style={getInputStyles()}
        />
        
        {/* Search button - only show if showButton is true */}
        {showButton && (
          <button 
            className="btn small" 
            type="submit"
            disabled={isSearching || !query.trim()} // Disable if searching or empty query
            aria-label={isSearching ? "Searching..." : "Search"} // Dynamic aria label
            style={{
              padding: variant === 'compact' ? '6px 12px' : '8px 14px',
              borderRadius: '999px',
              border: 'none',
              background: 'transparent',
              color: 'var(--accent)',
              fontWeight: '600',
              cursor: isSearching ? 'not-allowed' : 'pointer',
              border: '1px solid rgba(59,130,246,0.12)',
              opacity: isSearching || !query.trim() ? 0.6 : 1
            }}
          >
            {isSearching ? "..." : "SEARCH"}
          </button>
        )}
      </form>

      {/* Search suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          className="search-suggestions"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'white',
            border: '1px solid #e6edf8',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            zIndex: 1000,
            maxHeight: '200px',
            overflowY: 'auto'
          }}
          role="listbox" // ARIA role for suggestions list
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              className="suggestion-item"
              onClick={() => handleSuggestionClick(suggestion)} // Handle suggestion selection
              style={{
                width: '100%',
                padding: '12px 16px',
                border: 'none',
                background: 'none',
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: '14px',
                borderBottom: index < suggestions.length - 1 ? '1px solid #f0f0f0' : 'none'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'} // Hover effect
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              role="option" // ARIA role for suggestion item
            >
              🔍 {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// PropTypes for type checking
SearchBar.propTypes = {
  placeholder: PropTypes.string, // Placeholder text must be string
  onSearch: PropTypes.func, // Search callback must be function
  className: PropTypes.string, // CSS class must be string
  variant: PropTypes.oneOf(['default', 'compact', 'large']), // Predefined variants
  showButton: PropTypes.bool, // Show button control must be boolean
  autoFocus: PropTypes.bool, // Auto focus control must be boolean
  maxLength: PropTypes.number // Max length must be number
};

// Default props
SearchBar.defaultProps = {
  placeholder: "Find a waasha near you...",
  onSearch: null,
  className: "search-wrap",
  variant: "default",
  showButton: true,
  autoFocus: false,
  maxLength: 100
};

export default SearchBar;