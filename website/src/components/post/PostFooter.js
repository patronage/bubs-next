import styles from './PostFooter.module.scss';

export function PostFooter({ date, author, categories, tags }) {
  return (
    <div className={styles['post-footer']}>
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
