import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Calendar, User, Eye, ArrowLeft, Clock } from 'lucide-react';
import api from '../services/api';

const BlogPostDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    api.get(`/blog/${slug}`)
      .then((res) => {
        if (res.data && res.data.success) {
          setPost(res.data.data);
        }
      })
      .catch((err) => {
        console.error('Failed to load blog post:', err);
        setError('Blog post not found.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-navy-light"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="text-center py-20 bg-slate-50 min-h-screen">
        <p className="text-red-500 font-bold">{error || 'Article not found'}</p>
        <button onClick={() => navigate('/blog')} className="mt-4 bg-navy-light text-white px-5 py-2.5 rounded-xl">
          Back to Blog
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      
      {/* Header Context bar */}
      <section className="bg-white border-b border-slate-100 py-4 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between text-xs text-slate-500">
          <Link to="/blog" className="flex items-center hover:text-navy-light font-bold">
            <ArrowLeft size={14} className="mr-1.5" /> Back to Articles
          </Link>
          <span>Category: <strong className="text-navy-dark uppercase">{post.category}</strong></span>
        </div>
      </section>

      {/* Main Container */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden p-6 sm:p-10 space-y-6">
          
          {/* Metadata */}
          <div className="flex flex-wrap items-center text-[10px] sm:text-xs text-gray-500 space-x-4">
            <span className="flex items-center"><Calendar size={14} className="mr-1.5" /> {new Date(post.publishedAt).toLocaleDateString()}</span>
            <span className="flex items-center"><User size={14} className="mr-1.5" /> {post.author}</span>
            <span className="flex items-center"><Eye size={14} className="mr-1.5" /> {post.views} Views</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-dark leading-tight">{post.title}</h1>
          
          <p className="text-xs text-slate-500 italic bg-slate-50 border-l-4 border-orange-accent p-4 rounded-r-xl">
            {post.excerpt}
          </p>

          {/* Cover image */}
          {post.coverImage && (
            <div className="h-64 sm:h-[400px] rounded-2xl overflow-hidden shadow-sm border border-slate-100">
              <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
            </div>
          )}

          {/* Content */}
          <div 
            className="text-xs text-slate-700 leading-relaxed whitespace-pre-line border-t border-slate-100 pt-6 space-y-4"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

        </div>
      </section>

    </div>
  );
};

export default BlogPostDetail;
