import { ErrorHeader } from '@/components/Layout/Landing/components/Headers/ErrorHeader';
import {
  articleClass,
  contentClass,
  contentClassVariants,
} from '@/components/Layout/components/articleStyles.css';
import { Search } from '@/components/Search/Search';
import { SearchBar } from '@/components/SearchBar/SearchBar';
import { getPageConfig } from '@/utils/config';
import classNames from 'classnames';
import type { GetStaticProps } from 'next';
import type { NextRouter } from 'next/router';
import { useRouter } from 'next/router';
import type { FC, FormEvent } from 'react';
import React, { useState } from 'react';

interface IQuery {
  q?: string;
}

const createSearchQuery = (router: NextRouter): string => {
  const path = router.asPath;
  const { q } = router.query as IQuery;

  if (path.includes('/404')) return q || '';

  const string = path
    .split('/')
    .filter((val) => val !== 'docs')
    .join(' ');

  return string;
};

const NotFoundPage: FC = () => {
  const router = useRouter();
  const [query] = useState<string | undefined>(createSearchQuery(router));

  const handleSubmit = async (
    evt: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    evt.preventDefault();

    const data = new FormData(evt.currentTarget);
    const value = `${data.get('search')}`;
    await router.push(`/search?q=${value}`);
  };

  return (
    <>
      <ErrorHeader
        title="Not Found"
        subTitle="we couldn't find what you were looking for"
        body="Maybe these results can help you?"
      >
        <SearchBar onSubmit={handleSubmit} query={query} />
      </ErrorHeader>
      <div
        className={classNames(contentClass, contentClassVariants.home)}
        id="maincontent"
      >
        <article className={articleClass}>
          <Search query={query} />
        </article>
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context, ...args) => {
  return {
    props: {
      ...(await getPageConfig({ filename: __filename })),
      frontmatter: {
        title: '404 - Not found',
        menu: '404 - Not found',
        label: '404 - Not found',
        order: 0,
        description: 'Sorry, we did not find what you were looking for',
        layout: 'home',
      },
    },
  };
};

export default NotFoundPage;
