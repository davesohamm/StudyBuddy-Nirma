'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import SearchResults, { SearchSuggestions } from '@/components/search/SearchResults';
import { getSearchService } from '@/utils/search';
import { semester1Courses } from '@/data/courses';
import { SearchResult } from '@/types';
import { Search, ArrowLeft } from 'lucide-react';
import Link from 'next/link';


export default function SearchPageContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams?.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const searchService = useMemo(() => getSearchService(semester1Courses), []);

  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    // Simulate API delay for better UX
    setTimeout(() => {
      const searchResults = searchService.search(searchQuery);
      setResults(searchResults);
      setIsLoading(false);
    }, 300);
  };

  const handleInputChange = (value: string) => {
    setQuery(value);
    
    // Get suggestions for autocomplete
    if (value.length >= 2) {
      const quickSuggestions = searchService.getQuickSuggestions(value);
      setSuggestions(quickSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }

    // Debounced search
    const timeoutId = setTimeout(() => {
      handleSearch(value);
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    handleSearch(suggestion);
  };

  const handleResultClick = (result: SearchResult) => {
    // Navigate to course detail page if it's a course result
    if (result.type === 'course' && result.courseCode) {
      const course = semester1Courses.find(c => c.code === result.courseCode);
      if (course) {
        window.location.href = `/course/${course.id}`;
      }
    } else if (result.courseCode) {
      // For other types, navigate to course page and potentially scroll to specific section
      const course = semester1Courses.find(c => c.code === result.courseCode);
      if (course) {
        window.location.href = `/course/${course.id}`;
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setShowSuggestions(false);
      handleSearch(query);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back button */}
          <div className="mb-6">
            <Link 
              href="/"
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </div>

          {/* Search Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Portal</h1>
            <p className="text-gray-600">
              Search through courses, units, experiments, topics, and references
            </p>
          </div>

          {/* Enhanced Search Bar */}
          <div className="mb-8">
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onKeyPress={handleKeyPress}
                  onFocus={() => setShowSuggestions(suggestions.length > 0)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  placeholder="Search courses, topics, experiments, algorithms..."
                  className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-sm"
                />
              </div>

              {/* Search Suggestions */}
              {showSuggestions && (
                <SearchSuggestions
                  suggestions={suggestions}
                  onSuggestionClick={handleSuggestionClick}
                />
              )}
            </div>

            {/* Search Stats */}
            {query && !isLoading && (
              <div className="mt-4 text-sm text-gray-600">
                {results.length > 0 ? (
                  <span>Found {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"</span>
                ) : (
                  <span>No results found for "{query}"</span>
                )}
              </div>
            )}
          </div>

          {/* Quick Search Examples */}
          {!query && (
            <div className="mb-8 p-6 bg-white rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Searches</h3>
              <div className="flex flex-wrap gap-3">
                {[
                  'Programming',
                  'Operating Systems',
                  'Computer Networks',
                  'Database Design',
                  'Statistics',
                  'Hypothesis Testing',
                  'Microservices',
                  'Hadoop',
                  'Machine Learning',
                  'Data Structures',
                  'Optimization',
                  'Algorithms'
                ].map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      setQuery(term);
                      handleSearch(term);
                    }}
                    className="px-4 py-2 bg-gray-100 hover:bg-primary-100 hover:text-primary-700 text-gray-700 rounded-lg transition-colors duration-200 text-sm font-medium"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Results */}
          <SearchResults
            results={results}
            query={query}
            isLoading={isLoading}
            onResultClick={handleResultClick}
          />

          {/* Search Tips */}
          {query && results.length === 0 && !isLoading && (
            <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Search Tips</h3>
              <ul className="space-y-2 text-blue-800">
                <li className="flex items-start">
                  <span className="font-semibold mr-2">•</span>
                  <span>Try searching for specific topics like "programming", "operating systems", "database design", "statistics", "microservices", or "dynamic programming"</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">•</span>
                  <span>Use course codes like "6CS402CC22" (DSA), "6CS203CC22" (AML), "6CS271ME25" (Big Data), "6CS302CC25" (System Design), "6CS303CC25" (Statistics), or "6CS282VA25" (Capstone) to find specific course content</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">•</span>
                  <span>Search for lab exercises, references, CS fundamentals like "oop", "er diagrams", statistical tests like "anova", technologies like "sklearn", or learning outcomes</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">•</span>
                  <span>Try broader terms if specific searches don't yield results</span>
                </li>
              </ul>
            </div>
          )}

          {/* Content Categories */}
          {!query && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
              {[
                {
                  title: 'Course Units',
                  description: 'Search through all course units and their content',
                  icon: '📚',
                  searchTerm: 'unit'
                },
                {
                  title: 'Lab Experiments',
                  description: 'Find lab exercises and practical assignments',
                  icon: '🧪',
                  searchTerm: 'experiment'
                },
                {
                  title: 'Topics & Concepts',
                  description: 'Explore specific topics and concepts',
                  icon: '🎯',
                  searchTerm: 'algorithm'
                },
                {
                  title: 'References',
                  description: 'Browse through textbooks and references',
                  icon: '📖',
                  searchTerm: 'reference'
                }
              ].map((category) => (
                <button
                  key={category.title}
                  onClick={() => {
                    setQuery(category.searchTerm);
                    handleSearch(category.searchTerm);
                  }}
                  className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-primary-200 transition-all duration-200 text-left"
                >
                  <div className="text-3xl mb-3">{category.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.title}</h3>
                  <p className="text-sm text-gray-600">{category.description}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 