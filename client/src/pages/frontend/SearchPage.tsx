import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import ArticleCard from '../../components/ArticleCard'; // Ensure this path is correct
import { Skeleton } from '../../components/ui/skeleton';

const SearchPage = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');

    const { data: results, isLoading } = useQuery({
        queryKey: ['search', query],
        queryFn: async () => {
            // This hits your backend search route
            const { data } = await axios.get(`/api/articles?search=${query}`);
            return data.data.articles || [];
        },
        enabled: !!query, // Only run if there is a query
    });

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="mb-10">
                <h2 className="text-sm font-bold text-red-600 uppercase tracking-widest mb-2">Search Results</h2>
                <h1 className="text-4xl font-black text-slate-900">
                    Showing results for: <span className="italic">"{query}"</span>
                </h1>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[1, 2, 3].map(i => <Skeleton key={i} className="h-64 rounded-xl" />)}
                </div>
            ) : results.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {results.map((article: any) => (
                        <ArticleCard key={article._id} article={article} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                    <p className="text-slate-500 font-bold">No articles matched your search. Try different keywords.</p>
                </div>
            )}
        </div>
    );
};

export default SearchPage;