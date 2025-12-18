import { blogContent } from './blogContent';
import BlogDetailClient from './BlogDetailClient';

// Generate static params for static export
export async function generateStaticParams() {
  // Return all article IDs for static generation
  return Object.keys(blogContent).map((id) => ({
    id: id,
  }));
}

// Server component wrapper
export default async function BlogDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> | { id: string } 
}) {
  // Resolve params (handle both sync and async)
  const resolvedParams = params instanceof Promise ? await params : params;
  const articleId = resolvedParams.id;

  return <BlogDetailClient articleId={articleId} />;
}
