function Header({ postCount }) {
  return (
    <header className="header">
      <div>
        <span className="eyebrow">Sprint 11 · MERN Integration</span>
        <h1>MERN Post Manager</h1>
        <p>
          Posts are fetched directly from Express and MongoDB Atlas.
        </p>
      </div>

      <div className="post-count">
        <strong>{postCount}</strong>
        <span>{postCount === 1 ? "Post" : "Posts"}</span>
      </div>
    </header>
  );
}

export default Header;
