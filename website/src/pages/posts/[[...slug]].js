import Link from 'next/link';
//import { parseISO, format } from 'date-fns';
import { useRouter } from 'next/router';
import { getPost, getAllPostsWithSlug } from "lib/wordpress";

//import LayoutPost from '../../layouts/post';
//import LayoutArchive from '../../layouts/archive';

const POSTS_PER_PAGE = 1;

function BlogPostPage(props) {
  return (
    <div>
      Post Page
    </div>
  );
}

function BlogIndexPage(props) {
  return (
    <div>Index Page</div>
  );
}

function Blog(props) {
  const router = useRouter();
  const { query } = router;

  if (
    query && (
    Object.keys(query).length === 0 ||
    (query.slug && query.slug[0] === 'page'))
  ) {
    return BlogIndexPage(props);
  } else {
    return BlogPostPage(props);
  }
}

export async function getStaticProps(context) {
  /*const fs = require('fs');
  const marked = require('marked');
  const matter = require('gray-matter');*/

  if (
    Object.keys(context.params).length === 0 ||
    (context.params && context.params.slug && context.params.slug[0] === 'page')
  ) {
    const posts = [];
    //const postFiles = fs.readdirSync('./_blog').reverse();

    // Generate Post Paths
    // @TODO: support paginator
    /*for (let i = 0; i < postFiles.length; i++) {
      const slug = JEKYLL_FILENAME_REGEX.exec(postFiles[i])[2];
      const date = parseISO(
        JEKYLL_FILENAME_REGEX.exec(postFiles[i])[1]
      ).toISOString();

      const post = fs.readFileSync(`./_blog/${postFiles[i]}`, {
        encoding: 'utf8',
      });

      const { data: frontmatter, content } = matter(post);

      posts.push({
        slug,
        date,
        frontmatter,
        content: marked(content),
      });
    }*/

    return {
      props: { },
    };
  }

   try {
    const post = getPost(context.params.slug[0]);
    return { props: { post } };
  } catch (error) {}

  return {
    props: {
      notfound: true,
    },
  };
}

export async function getStaticPaths() {
  const allPosts = await getAllPostsWithSlug();
  const paths = [{ params: { slug: [] } }]; // Index Page
  const posts = allPosts.edges;

  // Generate Pagination Paths
  for (let i = 1; i <= Math.ceil(posts.length / POSTS_PER_PAGE); i++) {
    paths.push({ params: { slug: ['page', String(i)] } });
  }

  // Generate Post Paths
  for (const post of posts) {
    if ( post.node && post.node.slug ) {
      paths.push({ params: { slug: [post.node.slug] } });
    }    
  }

  return {
    paths,
    fallback: false,
  };
}

export default Blog;