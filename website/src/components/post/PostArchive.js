import Paginator from 'components/Paginator';
import Link from 'next/link';

const PostArchive = ({
  archiveTitle,
  posts,
  paginatorIndex,
  postsPerPage,
  totalPosts,
}) => {
  return (
    <>
      <h1>{archiveTitle ? `${archiveTitle} Posts` : 'Posts'}</h1>
      {posts.map((post, key) => {
        return (
          <div key={key}>
            <h2>
              <Link href={`/posts/${post.slug}`}>{post.title}</Link>
            </h2>
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
        );
      })}
      <Paginator
        index={paginatorIndex}
        postsPerPage={postsPerPage}
        totalPosts={totalPosts}
      />
    </>
  );
};

export default PostArchive;
