import { useState } from "react";
import { updateOverlay, deleteOverlay } from "../services/api";

function OverlayItem({ overlay, onUpdated }) {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    name: overlay.name,
    content: overlay.content,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleUpdate = async () => {
    try {
      await updateOverlay(overlay.id, {
        ...overlay,
        name: form.name,
        content: form.content,
      });
      alert("Overlay updated successfully!");
      setIsEditing(false);
      onUpdated();
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update overlay");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this overlay?")) return;
    try {
      await deleteOverlay(overlay.id);
      alert("Overlay deleted!");
      onUpdated();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete overlay.");
    }
  };

  return (
    <li style={{ marginBottom: "10px" }}>
      {isEditing ? (
        <>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Overlay name"
            style={{ marginRight: "8px" }}
          />
          <input
            name="content"
            value={form.content}
            onChange={handleChange}
            placeholder="Overlay content"
            style={{ marginRight: "8px" }}
          />
          <button
            onClick={handleUpdate}
            style={{
              background: "green",
              color: "white",
              border: "none",
              borderRadius: "5px",
              padding: "5px 10px",
            }}
          >
            Save
          </button>
          <button
            onClick={() => setIsEditing(false)}
            style={{
              marginLeft: "5px",
              border: "none",
              borderRadius: "5px",
              padding: "5px 10px",
            }}
          >
            Cancel
          </button>
        </>
      ) : (
        <>
          <strong>{overlay.name}</strong> — {overlay.content}
          <button
            onClick={() => setIsEditing(true)}
            style={{
              marginLeft: "10px",
              background: "#ebe70fff",
              color: "black",
              border: "none",
              borderRadius: "5px",
              padding: "5px 10px",
            }}
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            style={{
              marginLeft: "5px",
              background: "red",
              color: "white",
              border: "none",
              borderRadius: "5px",
              padding: "5px 10px",
            }}
          >
            Delete
          </button>
        </>
      )}
    </li>
  );
}

export default OverlayItem;
