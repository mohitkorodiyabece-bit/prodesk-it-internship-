import PostCard from "./PostCard";

function PostList({ posts, onDelete, deletingId }) {
  if (posts.length === 0) {
    return (
      <div className="empty-state">
        <h2>No posts found</h2>
        <p>Create your first post to populate the database.</p>
      </div>
    );
  }

  return (
    <section className="post-grid">
      {posts.map((post) => (
        <PostCard
          key={post._id}
          post={post}
          onDelete={onDelete}
          deleting={deletingId === post._id}
        />
      ))}
    </section>
  );
}

export default PostList;
