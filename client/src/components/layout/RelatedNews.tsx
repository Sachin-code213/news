import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

interface RelatedNewsProps {
    category: string;
    currentId: string;
}

const RelatedNews: React.FC<RelatedNewsProps> = ({ category, currentId }) => {
    const { lang, t } = useLanguage();

    const { data: related } = useQuery({
        queryKey: ['related-news', category, currentId],
        queryFn: async () => {
            const { data } = await axios.get(`/api/articles?category=${category}&limit=4`);
            // Filter out the article the user is currently reading
            return data.data.articles.filter((a: any) => a._id !== currentId).slice(0, 3);
        }
    });

    if (!related || related.length === 0) return null;

    return (
        <div className="mt-16 pt-10 border-t border-slate-100">
            <h3 className="text-2xl font-black mb-8 uppercase tracking-tighter italic">
                {t('Read More in', 'थप समाचार')} <span className="text-red-600">{category}</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {related.map((item: any) => (
                    <Link key={item._id} to={`/article/${item.slug}`} className="group space-y-3">
                        <div className="relative aspect-video overflow-hidden rounded-xl">
                            <img
                                src={item.image.startsWith('http') ? item.image : `http://localhost:5000/uploads/${item.image}`}
                                alt={item.titleEn}
                                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                        <h4 className="font-bold leading-tight group-hover:text-red-600 transition-colors">
                            {lang === 'en' ? item.titleEn : item.titleNe}
                        </h4>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default RelatedNews;