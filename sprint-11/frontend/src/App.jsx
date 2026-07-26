import { useEffect, useState } from "react";
import {
  createPost,
  deletePost,
  fetchPosts,
} from "./api/postApi";
import ErrorMessage from "./components/ErrorMessage";
import Header from "./components/Header";
import LoadingSpinner from "./components/LoadingSpinner";
import PostForm from "./components/PostForm";
import PostList from "./components/PostList";

function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    let ignoreResponse = false;

    fetchPosts()
      .then((postData) => {
        if (!ignoreResponse) {
          setPosts(postData);
        }
      })
      .catch((requestError) => {
        if (!ignoreResponse) {
          setError(requestError.message);
        }
      })
      .finally(() => {
        if (!ignoreResponse) {
          setLoading(false);
        }
      });

    return () => {
      ignoreResponse = true;
    };
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError("");

      const postData = await fetchPosts();
      setPosts(postData);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (postData) => {
    try {
      setSubmitting(true);
      setActionError("");

      const createdPost = await createPost(postData);

      setPosts((currentPosts) => [
        createdPost,
        ...currentPosts,
      ]);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      setDeletingId(postId);
      setActionError("");

      await deletePost(postId);

      setPosts((currentPosts) =>
        currentPosts.filter((post) => post._id !== postId)
      );
    } catch (requestError) {
      setActionError(requestError.message);
    } finally {
      setDeletingId("");
    }
  };

  return (
    <main className="app-shell">
      <Header postCount={posts.length} />

      <PostForm
        onCreate={handleCreatePost}
        submitting={submitting}
      />

      {actionError && (
        <div className="action-error" role="alert">
          {actionError}
        </div>
      )}

      {loading && <LoadingSpinner />}

      {!loading && error && (
        <ErrorMessage
          message={error}
          onRetry={loadPosts}
        />
      )}

      {!loading && !error && (
        <PostList
          posts={posts}
          onDelete={handleDeletePost}
          deletingId={deletingId}
        />
      )}
    </main>
  );
}

export default App;
