# KISK Scrapbook

[Scrapbook](https://kisk.vercel.app/) is the place where we share our learning journey.
The goal of the scrapbook is to create a place where we will enjoy coming back to find
out what others are working on and support each other.

## Principles

- The design and development [are the same thing](https://www.youtube.com/watch?v=3hccXiXI0u8).
- Every feature has to be mobile-first.

## Design decisions

Web app

- the site is powered by [next.js 13](https://nextjs.org/) which is currently in beta
  and its features are not stable. this project was partly created to test the new version
  of the framework, provide feedback to its developers and form opinion on it.
- some of the features are developed rapidly, thus we expect errors to occur and the project
  structure is is not polished. we keep it modular though so developing new features is not
  slowed down by making sure to reuse existing code
- to ensure accessibility support, [React Aria](https://react-spectrum.adobe.com/react-aria/)
  is used whenever possible

Database and API

- the only database used is [Supabase](https://supabase.com/) free tier instance, which is
  [kept alive by github action](https://github.com/kisk-muni/scrapbook/blob/main/.github/workflows/keep-supabase-alive.yaml)
  (Supabase pauses free projects after one week of inactivity)
- the database schema definitions and configs are stored in
  [supabase folder](https://github.com/kisk-muni/scrapbook/tree/main/supabase) in the root of the project
- posts from portfolios are fetched hourly by cron job which runs on the database and invokes
  [feed-source function](./supabase/functions/feed-source/index.ts) on every portfolio from
  [student portfolios list](https://kisk.vercel.app/students)

## Origin of Scrapbook

Significant parts of the project are copied from, derived from, or
inspired by [Hack Club’s Scrapbook](https://github.com/hackclub/scrapbook)
which is released under MIT License.
