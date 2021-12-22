import { parseISO, format } from 'date-fns';
import Link from 'next/link';
import React from 'react';
import * as widont from 'widont';
import styles from './PostHeader.module.scss';

export function PostHeader({
  title,
  titleLink,
  date,
  author,
  categories,
  tags,
  slug,
}) {
  // prepeare date
  const dateISO = parseISO(date);

  // remove uncategorized from categories

  return (
    <div className={styles['post-header']}>
      {(date || author || categories) && (
        <div className={styles.meta}>
          <time dateTime={dateISO} className="date">
            {format(dateISO, 'MMMM d, y')}
          </time>
          {/* todo: linkable categories */}
          {categories?.edges.length > 0 ? (
            categories?.edges.map(
              (category, index) =>
                category.node.name != 'Uncategorized' && (
                  <React.Fragment key={index}>
                    <span className={styles.divider}>/</span>
                    <span className="category">
                      {category.node.name}
                    </span>
                  </React.Fragment>
                ),
            )
          ) : (
            <span className="category">
              {categories?.edges.node.name}
            </span>
          )}
        </div>
      )}
      {titleLink ? (
        <h1>
          <Link href="/posts/[postslug]" as={`/posts/${slug}`}>
            <a>{widont(title)}</a>
          </Link>
        </h1>
      ) : (
        <h1>{widont(title)}</h1>
      )}
    </div>
  );
}
