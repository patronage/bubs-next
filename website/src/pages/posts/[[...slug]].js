import Link from 'next/link';
import { useRouter } from 'next/router';
import { getPost, getAllPostsWithSlug } from "lib/wordpress";

import Layout from "components/layout";
import Paginator from 'components/paginator'

const POSTS_PER_PAGE = 1;

function BlogPostPage({ post }) {
  return (
    <Layout title={ post.title }>
      <h1>{ post.title }</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </Layout>
  );
}

function BlogIndexPage({ posts, paginatorIndex, postsPerPage, totalPosts }) {
  return (
    <Layout title="">
      <h1>Posts</h1>
      {posts.map((post, key) => {
        return (
        <div key={key}>
          <h2><Link href={`/posts/${ post.slug }`}>{post.title}</Link></h2>
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
        );
      })}
      <Paginator index={ paginatorIndex } postsPerPage={ postsPerPage } totalPosts={ totalPosts } />
    </Layout>
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
  //
  // Generate props for Post Index page
  //
  if (
    // URL is /posts
    Object.keys(context.params).length === 0 ||
    // URL is /posts/page/*
    ( context.params && context.params.slug && context.params.slug[0] === 'page' )          
  ) {    
    // 404 if the paginator ID is non-numeric
    if ( context.params && context.params.slug && context.params.slug[1] && isNaN(Number(context.params.slug[1])) ) {
      return {
        props: {
          notfound: true,
        },
      };
    }

    const posts = [];
    // Get the zero-indexed paginator index (remember URL is indexed by 1)
    const page = ( context.params.slug ? Number(context.params.slug[1]) : 1 ) - 1;
    const allPosts = await getAllPostsWithSlug();
    const sliceStart = page * POSTS_PER_PAGE;
    const filteredPosts = allPosts.edges.slice( sliceStart, sliceStart + POSTS_PER_PAGE );

    // Generate Post Paths    
    for (let i = 0; i < filteredPosts.length; i++) {      
      const slug = filteredPosts[i].node.slug;
      const { postBy } = await getPost(slug);
      posts.push(postBy);
    }

    return {
      props: { 
        posts, 
        // Paginator Helpers
        paginatorIndex: page + 1, // 1-Indexed as this is strictly for display
        postsPerPage: POSTS_PER_PAGE,
        totalPosts: allPosts.edges.length,
      }
    };
  }

  //
  // Generate props for Post Single Page
  //
   try {
    const { postBy } = await getPost(context.params.slug[0]);
    return { props: { post: postBy } };
  } catch (error) {}

  //
  // No condition was met for this catch-all route, send 404
  //
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