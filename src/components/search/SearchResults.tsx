'use client';

import { SearchResult } from '@/types';
import { BookOpen, FileText, FlaskConical, Tag, ExternalLink } from 'lucide-react';

interface SearchResultsProps {
  results: SearchResult[];
  query: string;
  isLoading?: boolean;
  onResultClick?: (result: SearchResult) => void;
}

export default function SearchResults({ results, query, isLoading, onResultClick }: SearchResultsProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'course': return <BookOpen className="h-4 w-4" />;
      case 'unit': return <FileText className="h-4 w-4" />;
      case 'experiment': return <FlaskConical className="h-4 w-4" />;
      case 'topic': return <Tag className="h-4 w-4" />;
      case 'reference': return <ExternalLink className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'course': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'unit': return 'bg-green-100 text-green-800 border-green-200';
      case 'experiment': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'topic': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'reference': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'course': return 'Course';
      case 'unit': return 'Unit';
      case 'experiment': return 'Lab';
      case 'topic': return 'Topic';
      case 'reference': return 'Reference';
      default: return 'Content';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex space-x-4">
              <div className="w-8 h-8 bg-gray-200 rounded"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!query.trim()) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Start Searching</h3>
        <p className="text-gray-600">
          Search for courses, topics, experiments, or any content from your syllabus
        </p>
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
            Try: "programming"
          </span>
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
            Try: "operating systems"
          </span>
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
            Try: "database design"
          </span>
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
            Try: "statistics"
          </span>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Results Found</h3>
        <p className="text-gray-600 mb-4">
          No content found for "{query}". Try different keywords or check spelling.
        </p>
        <div className="text-sm text-gray-500">
          <p>Search tips:</p>
          <ul className="mt-2 space-y-1">
            <li>• Try broader terms like "algorithm" instead of "algorithmic"</li>
            <li>• Use individual words rather than long phrases</li>
            <li>• Check course codes like "6CS402CC22"</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          Search Results for "{query}"
        </h3>
        <p className="text-sm text-gray-600">
          Found {results.length} result{results.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
        {results.map((result) => (
          <div
            key={result.id}
            className="p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
            onClick={() => onResultClick?.(result)}
          >
            <div className="flex items-start space-x-3">
              <div className={`flex-shrink-0 p-2 rounded-lg border ${getTypeColor(result.type)}`}>
                {getTypeIcon(result.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getTypeColor(result.type)}`}>
                    {getTypeLabel(result.type)}
                  </span>
                  {result.courseCode && (
                    <span className="text-xs text-gray-500 font-mono">
                      {result.courseCode}
                    </span>
                  )}
                  {result.unitNumber && (
                    <span className="text-xs text-gray-500">
                      {result.unitNumber}
                    </span>
                  )}
                </div>

                <h4 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">
                  {result.title}
                </h4>

                <p
                  className="text-sm text-gray-600 line-clamp-2 mb-2"
                  dangerouslySetInnerHTML={{
                    __html: result.highlightedText || result.description
                  }}
                />

                {result.courseName && result.type !== 'course' && (
                  <div className="flex items-center text-xs text-gray-500">
                    <BookOpen className="h-3 w-3 mr-1" />
                    {result.courseName}
                  </div>
                )}
              </div>

              <div className="flex-shrink-0 text-xs text-gray-400">
                Score: {Math.round(result.relevanceScore)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {results.length >= 50 && (
        <div className="p-4 bg-gray-50 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            Showing top 50 results. Try a more specific search for better results.
          </p>
        </div>
      )}
    </div>
  );
}

// Helper component for search suggestions
export function SearchSuggestions({ 
  suggestions, 
  onSuggestionClick 
}: { 
  suggestions: string[]; 
  onSuggestionClick: (suggestion: string) => void;
}) {
  if (suggestions.length === 0) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          className="w-full text-left px-4 py-2 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors duration-150"
          onClick={() => onSuggestionClick(suggestion)}
        >
          <span className="text-sm text-gray-900">{suggestion}</span>
        </button>
      ))}
    </div>
  );
} 