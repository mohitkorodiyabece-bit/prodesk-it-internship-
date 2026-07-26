const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const parseResponse = async (response) => {
  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.message || "The server request failed");
  }

  return result;
};

export const fetchPosts = async () => {
  const response = await fetch(`${API_URL}/posts`);
  const result = await parseResponse(response);

  return result.data;
};

export const createPost = async (formData) => {
  const response = await fetch(`${API_URL}/posts`, {
    method: "POST",
    body: formData,
  });

  const result = await parseResponse(response);

  return result.data;
};

export const deletePost = async (postId) => {
  const response = await fetch(`${API_URL}/posts/${postId}`, {
    method: "DELETE",
  });

  return parseResponse(response);
};
