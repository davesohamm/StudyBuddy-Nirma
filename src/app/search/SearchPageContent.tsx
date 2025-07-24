'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import SearchResults from '@/components/search/SearchResults';
import { SearchResult } from '@/types';

export default function SearchPageContent() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setQuery(q);
      performSearch(q);
    }
  }, [searchParams]);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      // For now, return mock results since we don't have a search API endpoint
      // You can replace this with actual API call when search backend is implemented
      const mockResults: SearchResult[] = [
        {
          id: '1',
          title: `Search results for "${searchQuery}"`,
          description: 'No search implementation yet. This is a placeholder for future search functionality.',
          type: 'topic',
          relevanceScore: 1.0,
          highlightedText: searchQuery
        }
      ];
      
      setResults(mockResults);
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Search Results</h1>
          <SearchResults 
            query={query} 
            results={results} 
            isLoading={isLoading}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
} 