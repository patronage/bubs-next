import styles from './PostBody.module.scss';

export default function PostBody({ content }) {
  return (
    <div
      className={styles.content}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
