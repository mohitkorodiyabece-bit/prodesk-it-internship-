function PostCard({ post, onDelete, deleting }) {
  const author = post.author || post.authorId || "Unknown author";

  return (
    <article className="post-card">
      {post.thumbnail && (
        <img
          className="post-card__image"
          src={post.thumbnail}
          alt={`${post.title} thumbnail`}
        />
      )}

      <div className="post-card__content">
        <span className="post-card__label">MongoDB Post</span>

        <h2>{post.title}</h2>
        <p>{post.content}</p>

        <div className="post-card__footer">
          <div>
            <span>By {author}</span>

            <time>
              {post.createdAt
                ? new Date(post.createdAt).toLocaleDateString()
                : "Date unavailable"}
            </time>
          </div>

          <button
            className="delete-button"
            type="button"
            onClick={() => onDelete(post._id)}
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </article>
  );
}

export default PostCard;
