import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
  const { slug } = params;
  const modules = import.meta.glob('/src/content/languages/*.mdx');
  const path = `/src/content/languages/${slug}.mdx`;

  if (!modules[path]) throw new Error(`Language not found: ${slug}`);
  const mod = await modules[path]() as { default: unknown; metadata: Record<string, unknown> };

  return {
    content: mod.default,
    meta: mod.metadata
  };
};
