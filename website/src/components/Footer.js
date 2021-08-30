import cx from 'classnames';
import GlobalsContext from 'contexts/GlobalsContext';
import formatMenu from 'lib/formatMenu';
import Link from 'next/link';
import { useContext } from 'react';
import {
  FaFacebookF,
  FaLinkedinIn,
  FaInstagram,
  FaTwitter,
  FaYoutube,
} from 'react-icons/fa';
import { IoLogoTiktok } from 'react-icons/io5';
import styles from './Footer.module.scss';

export default function Footer() {
  const globals = useContext(GlobalsContext);

  // populate and format menus
  const footerNav = Array.isArray(globals?.menuFooter?.nodes)
    ? formatMenu(globals.menuFooter.nodes)
    : [];

  const secondaryNav = Array.isArray(
    globals?.menuFooterSecondary?.nodes,
  )
    ? formatMenu(globals.menuFooterSecondary.nodes)
    : [];

  const socialNav = Array.isArray(globals?.menuFooterSocial?.nodes)
    ? formatMenu(globals.menuFooterSocial.nodes)
    : [];

  let hideSocial = false;
  // let hideSignup = false;
  let hideNav = false;
  // let hideSearch = false;

  if (globals.pageOptions?.footerStyle == 'basic') {
    hideNav = true;
    // hideSearch = true;
    // hideSignup = true;
    hideSocial = true;
  } else if (globals.pageOptions?.footerStyle == 'custom') {
    hideNav = globals.pageOptions?.hideNav;
    // hideSearch = globals.pageOptions?.hideSearch;
    // hideSignup = globals.pageOptions?.hideSignup;
    hideSocial = globals.pageOptions?.hideSocial;
  }

  return (
    <footer
      className={cx(
        'section-padded bg-dark text-white',
        styles.footer,
      )}
    >
      <div className="container">
        {!hideNav && footerNav.length > 0 && (
          <div
            className={cx([
              styles.primary,
              'row row-cols-2 row-cols-lg-auto',
            ])}
          >
            {footerNav.map((item, i) => (
              <div key={i}>
                <Link href={item.path}>
                  <a className={styles.topLevel}>{item.label}</a>
                </Link>
                {item.children && item.children.length > 0 && (
                  <ul className="list-unstyled">
                    {item.children.map((item, i) => (
                      <li key={i}>
                        <Link href={item.path}>
                          <a>{item.label}</a>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        <div className={cx([styles.copyright, 'row text-center'])}>
          <div className="col">
            {secondaryNav.length > 0 && (
              <ul className="list-inline mb-0">
                {secondaryNav.map((item, i) => (
                  <li className="list-inline-item" key={i}>
                    <Link href={item.path} prefetch={false}>
                      <a>{item.label}</a>
                    </Link>
                    <span className={styles.divider}>|</span>
                  </li>
                ))}
              </ul>
            )}
            <p
              dangerouslySetInnerHTML={{
                __html:
                  globals?.acfOptionsThemeSettings?.acfGlobalOptions
                    ?.footer?.footerCopyright,
              }}
            >
              {/*&copy; copyright {new Date().getFullYear()}{' '}*/}
            </p>
          </div>
        </div>

        {!hideSocial && socialNav.length > 0 && (
          <div
            className={cx([
              styles.social,
              'row row-cols-12 text-center',
            ])}
          >
            <ul className="list-inline mb-0">
              {socialNav.map((item, i) => (
                <li className="list-inline-item" key={i}>
                  <a
                    href={item.path}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {item.path.includes('instagram.com') && (
                      <FaInstagram />
                    )}
                    {item.path.includes('twitter.com') && (
                      <FaTwitter />
                    )}
                    {item.path.includes('youtube.com') && (
                      <FaYoutube />
                    )}
                    {item.path.includes('facebook.com') && (
                      <FaFacebookF />
                    )}
                    {item.path.includes('linkedin.com') && (
                      <FaLinkedinIn />
                    )}
                    {item.path.includes('tiktok.com') && (
                      <IoLogoTiktok />
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </footer>
  );
}
