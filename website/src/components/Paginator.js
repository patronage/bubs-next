import Link from 'next/link';
import styles from './Paginator.module.scss';

const Paginator = ({ index, postsPerPage, totalPosts }) => {
  const pages = [];
  const totalPages = totalPosts / postsPerPage;

  for (let i = 0; i < totalPages; i++) {
    pages.push(i + 1);
  }

  return (
    <div className={styles.paginator}>
      {pages.map((page, key) => (
        <div key={key}>
          {page === index ? (
            <strong>{page}</strong>
          ) : (
            <Link href={`/posts/page/${page}`}>
              <a>{page}</a>
            </Link>
          )}
        </div>
      ))}
    </div>
  );
};

export default Paginator;
