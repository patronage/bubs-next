import cx from 'classnames';
import { getContent } from 'lib/wordpress';
import { useRouter } from 'next/router';
import { useState } from 'react';
// import styles from './PagePassword.module.scss';

const getPasswordPost = async ({ router, password }) => {
  if (password) {
    const slug = `/${router.query.slug.join('/')}`;
    const data = await getContent({
      slug,
      preview: false,
      options: {
        password: password,
      },
    });

    if (data) {
      return data.contentNode;
    }
  }

  return null;
};

export default function PagePassword({ setPost, badPassword }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handlePasswordSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const password = e.target.post_password.value;
    const content = await getPasswordPost({ router, password });
    if (content) {
      setPost(content);
    }
    setLoading(false);
  }

  return (
    <div
    // className={styles.singlePassword}
    >
      <section className="section-padded">
        <div className="container">
          <form method="post" onSubmit={handlePasswordSubmit}>
            <div className="row align-items-center g-3">
              <div className="col-auto">
                <label htmlFor="pwbox" className="visually-hidden">
                  Password:
                </label>
                <input
                  className={cx(
                    // styles.fwdFormControl,
                    'form-control',
                  )}
                  name="post_password"
                  id="pwbox"
                  type="password"
                  placeholder="Password"
                  size="20"
                  maxLength="20"
                />
              </div>
              <div className="col-auto">
                <button
                  className={cx(
                    // styles.fwdFormControl,
                    // styles.btn,
                    'form-control btn btn-primary',
                  )}
                  type="submit"
                  name="Submit"
                  disabled={loading}
                >
                  {loading ? 'Loading' : 'Submit'}
                </button>
              </div>
            </div>
          </form>
          <div className="row">
            <div className="col-auto">
              {badPassword && !loading && (
                <div
                // className={styles.badPassword}
                >
                  Incorrect password
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <section className="section-padded"></section>
    </div>
  );
}
