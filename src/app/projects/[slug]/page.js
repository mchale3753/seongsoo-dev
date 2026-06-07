import { redirect } from 'next/navigation';
import { buildMetadata } from '@/lib/meta';
import content from '@/data/content.json';

const details = content.projectDetails;

export function generateStaticParams() {
  return Object.keys(details).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = details[slug];
  if (!page) return {};
  return buildMetadata(page.meta);
}

// /projects/<slug>/ → /?modal=<slug>  (index opens modal automatically)
export default async function Page({ params }) {
  const { slug } = await params;
  redirect(`/?modal=${slug}`);
}
