import { useEffect, useRef, useState } from "react";

const initialForm = {
  title: "",
  content: "",
  author: "",
};

function PostForm({ onCreate, submitting }) {
  const [formData, setFormData] = useState(initialForm);
  const [thumbnail, setThumbnail] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [formError, setFormError] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];

    setFormError("");

    if (!selectedFile) {
      setThumbnail(null);
      setPreviewUrl("");
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      setFormError("Only JPG, PNG and WebP images are allowed.");
      event.target.value = "";
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setFormError("The thumbnail must be 5 MB or smaller.");
      event.target.value = "";
      return;
    }

    setThumbnail(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");

    const title = formData.title.trim();
    const content = formData.content.trim();
    const author = formData.author.trim();

    if (!title || !content || !author) {
      setFormError("Please complete all required fields.");
      return;
    }

    const requestData = new FormData();

    requestData.append("title", title);
    requestData.append("content", content);
    requestData.append("author", author);

    if (thumbnail) {
      requestData.append("thumbnail", thumbnail);
    }

    try {
      await onCreate(requestData);

      setFormData(initialForm);
      setThumbnail(null);
      setPreviewUrl("");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      setFormError(error.message);
    }
  };

  return (
    <section className="form-panel">
      <div className="form-panel__header">
        <span className="eyebrow">Data Injection</span>
        <h2>Create a new post</h2>
        <p>
          Add text and an optional thumbnail. The data will be stored
          using MongoDB Atlas and Cloudinary.
        </p>
      </div>

      <form className="post-form" onSubmit={handleSubmit}>
        <label>
          Title
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter post title"
            minLength="3"
            maxLength="120"
            disabled={submitting}
          />
        </label>

        <label>
          Author
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            placeholder="Enter author name"
            maxLength="80"
            disabled={submitting}
          />
        </label>

        <label className="post-form__full">
          Content
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Write your post content"
            minLength="5"
            maxLength="2000"
            rows="5"
            disabled={submitting}
          />
        </label>

        <label className="post-form__full">
          Thumbnail image
          <input
            ref={fileInputRef}
            className="file-input"
            type="file"
            name="thumbnail"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            disabled={submitting}
          />

          <small>Optional · JPG, PNG or WebP · Maximum 5 MB</small>
        </label>

        {previewUrl && (
          <div className="image-preview">
            <img src={previewUrl} alt="Selected thumbnail preview" />
          </div>
        )}

        {formError && (
          <p className="form-error" role="alert">
            {formError}
          </p>
        )}

        <button
          className="primary-button"
          type="submit"
          disabled={submitting}
        >
          {submitting ? "Uploading and creating..." : "Create post"}
        </button>
      </form>
    </section>
  );
}

export default PostForm;
