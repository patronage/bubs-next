import cx from 'classnames';
import { WORDPRESS_URL } from 'lib/constants';
import { useState, useEffect } from 'react';
import { BsInfoCircle } from 'react-icons/bs';
import styles from './PreviewModeBar.module.scss';

const WORDPRESS_EDIT_URL =
  process.env.WORDPRESS_EDIT_URL ||
  `${WORDPRESS_URL}/wp-admin/post.php?action=edit`;

export default function PreviewModeBar({
  postId,
  position = 'bottom',
}) {
  const [redirect, setRedirect] = useState('/api/exit-preview');
  let positionClassName = styles['top'];

  if (position === 'bottom') {
    positionClassName = styles['bottom'];
  }

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
            {postId && (
              <>
                &nbsp;&nbsp;|&nbsp;&nbsp;
                <a
                  href={`${WORDPRESS_EDIT_URL}&post=${postId}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Edit
                </a>
                &nbsp;&nbsp;|&nbsp;&nbsp;
              </>
            )}
            <a href={redirect}>Exit</a>
          </div>
        </div>
      </div>
    </section>
  );
}
