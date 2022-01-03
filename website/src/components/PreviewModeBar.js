import cx from 'classnames';
import { WORDPRESS_URL } from 'lib/constants';
import { useState, useEffect } from 'react';
import { BsInfoCircle } from 'react-icons/bs';
import styles from './PreviewModeBar.module.scss';

export default function PreviewModeBar({
  postId,
  position = 'bottom',
  isRevision,
}) {
  const [redirect, setRedirect] = useState('/api/exit-preview');
  let positionClassName = styles['top'];

  if (position === 'bottom') {
    positionClassName = styles['bottom'];
  }

  // postId is either a string or a number. If string, that means the post is not published yet, and we get a URI like: `?page_id=3&preview=true&revision_id=58`

  useEffect(() => {
    if (typeof location !== 'undefined') {
      setRedirect(
        `/api/exit-preview?redirect=${encodeURIComponent(
          location.href,
        )}`,
      );
    }
  }, []);

  return (
    <section className={cx(styles.bar, positionClassName)}>
      <div className="container">
        <div className="row">
          <div className="col text-center">
            <span className={styles.icon}>
              <BsInfoCircle />
            </span>
            You are viewing this site in Preview Mode
            <span className="d-inline-block ps-1 pe-1">|</span>
            {postId && (
              <>
                <a
                  href={
                    isRevision
                      ? `${WORDPRESS_URL}/wp-admin/revision.php?revision=${postId}`
                      : `${WORDPRESS_URL}/wp-admin/post.php?action=edit&post=${postId}`
                  }
                  target="_blank"
                  rel="noreferrer"
                >
                  Edit
                </a>
                <span className="d-inline-block ps-1 pe-1">|</span>
              </>
            )}
            <a href={redirect}>Exit</a>
          </div>
        </div>
      </div>
    </section>
  );
}
