'use server';

import { db } from 'db';

export type UniversalPost = {
  id: string;
  publishedAt: Date;
  description: string | null;
  type: 'native' | 'portfolio';
  thumbnailUrl?: string | null;
  html: string | null;
  url: string | null;
  title: string | null;
  profile: {
    id: string;
    fullName: string | null;
    username: string;
    image: string | null;
  };
};

export default async function getPosts({
  pageParam = { native: 0, portfolio: 0 },
}: {
  pageParam: unknown;
}) {
  const nativeOffset = (pageParam as any).native || 0;
  const portfolioOffset = (pageParam as any).portfolio || 0;

  const nativePosts = (
    await db.query.posts.findMany({
      limit: FETCH_POSTS_LIMIT,
      orderBy: (posts, { desc }) => [desc(posts.publishedAt)],
      offset: nativeOffset,
      with: {
        profiles: {
          with: {
            profile: true,
          },
        },
      },
    })
  )
    .map((post) => {
      if (!post.profiles.length) {
        console.log('post', post);
      }
      return post;
    })
    .filter(
      (post) => post.profiles.length > 0 && post.profiles[0].profile.isPublic
    );

  const portfolioPosts = (
    await db.query.portfolioPosts.findMany({
      limit: FETCH_POSTS_LIMIT,
      orderBy: (posts, { desc }) => [desc(posts.publishedAt)],
      offset: portfolioOffset,
      with: {
        portfolio: {
          with: {
            profile: true,
          },
        },
      },
    })
  )
    .map((post) => {
      if (!post.portfolio.profile) {
        console.log('post', post);
      }
      return post;
    })
    .filter(
      (post) => post.portfolio.profile && post.portfolio.profile.isPublic
    );

  const allPosts = [
    ...nativePosts.map((post) => ({
      type: 'native',
      id: post.id,
      publishedAt: post.publishedAt,
      description: post.description,
      html: post.html,
      profile: post.profiles[0].profile,
      title: null,
      url: null,
    })),
    ...portfolioPosts.map((post) => ({
      type: 'portfolio',
      id: post.id,
      publishedAt: post.publishedAt,
      title: post.title,
      description: post.description,
      thumbnailUrl: post.thumbnailUrl,
      url: post.url,
      profile: post.portfolio.profile,
    })),
  ] as UniversalPost[];

  // order by publishedAt and return first 30 posts
  return allPosts
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
    .slice(0, FETCH_POSTS_LIMIT);
}

const FETCH_POSTS_LIMIT = 30;
