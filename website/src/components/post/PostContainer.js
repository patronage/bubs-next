import Link from 'next/link';
import { parseISO, format } from 'date-fns';
import * as widont from 'widont';

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
