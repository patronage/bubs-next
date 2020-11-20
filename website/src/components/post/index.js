import Link from "next/link";
import { parseISO, format } from "date-fns";
import * as widont from "widont";

import styles from "./post.module.scss";

export function PostContainer({ children }) {
  return (
    <article className="py-5">
      <div className={`container ${styles.container}`}>
        <div className="row justify-content-center">
          <div className="col-md-10 col-xl-9">{children}</div>
        </div>
      </div>
    </article>
  );
}

export function PostList({ children }) {
  return <article className="py-5">{children}</article>;
}

export function PostBody({ content }) {
  return (
    <div
      className={styles.content}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}

export function PostSummary({ excerpt }) {
  return (
    <div
      className={styles.content}
      dangerouslySetInnerHTML={{ __html: excerpt }}
    />
  );
}

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
    <div className={styles["post-header"]}>
      {(date || author || categories) && (
        <div className={styles.meta}>
          <time dateTime={dateISO} className="date">
            {format(dateISO, "MMMM d, y")}
          </time>
          {/* todo: linkable categories */}
          {categories?.edges.length > 0 ? (
            categories?.edges.map(
              (category, index) =>
                category.node.name != "Uncategorized" && (
                  <React.Fragment key={index}>
                    <span className={styles.divider}>/</span>
                    <span className="category">{category.node.name}</span>
                  </React.Fragment>
                )
            )
          ) : (
            <span className="category">{categories?.edges.node.name}</span>
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

export function PostFooter({ date, author, categories, tags }) {
  return (
    <div className={styles["post-footer"]}>
      <div className={styles.meta}>
        {tags?.edges.length > 0 && <span>Tagged: &nbsp;</span>}
        {tags.edges.map((tag, index) => (
          <span key={index}>{tag.node.name}</span>
          // TODO: Link Tags
          // <Link key={index} href="/company/[slug]" as={`/company/${tag.node.slug}`}>
          // <Link key={index} href={`/index?${tag.node.slug}`}>
          //   <a className="stylesml-4 font-normal">{tag.node.name}</a>
          // </Link>
        ))}
      </div>
    </div>
  );
}
