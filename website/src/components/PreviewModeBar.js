import cx from 'classnames';
import { WORDPRESS_DOMAIN } from 'lib/constants';
import { useState, useEffect } from 'react';
import styles from './PreviewModeBar.module.scss';

const WORDPRESS_EDIT_URL =
  process.env.WORDPRESS_EDIT_URL ||
  `https://${WORDPRESS_DOMAIN}/wp-admin/post.php?action=edit`;

export default function PreviewModeBar({ postId, position = 'top' }) {
  const [redirect, setRedirect] = useState('/api/exit-preview');
  let positionClassName = styles['top'];

  if ( position === 'bottom' ) {
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
            You are viewing this site in Preview Mode.{' '}
            {postId && (
              <>
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
            <a href={redirect}>Exit Preview Mode</a>
          </div>
        </div>
      </div>
    </section>
  );
}
