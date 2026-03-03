import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import ArticleCard from '../components/ArticleCard'; // Assuming you have this

const SearchResultsPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');

    const { data, isLoading } = useQuery({
        queryKey: ['search', query],
        queryFn: async () => {
            const { data } = await axios.get(`/api/articles?keyword=${query}`);
            return data.data.articles;
        },
        enabled: !!query
    });

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Search results for: "{query}"</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {isLoading ? (
                    <p>Searching articles...</p>
                ) : data?.length > 0 ? (
                    data.map((article: any) => <ArticleCard key={article._id} article={article} />)
                ) : (
                    <p>No articles found for your search.</p>
                )}
            </div>
        </div>
    );
};

export default SearchResultsPage;