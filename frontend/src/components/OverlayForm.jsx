import { useState } from "react";
import { createOverlay } from "../services/api";
import "../App.css"; // Make sure CSS is imported

function OverlayForm({ onOverlayCreated }) {
  const [form, setForm] = useState({
    name: "",
    type: "text",
    content: "",
    x: 0.05,
    y: 0.05,
    width: 0.2,
    height: 0.1,
    opacity: 0.9,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      x: parseFloat(form.x),
      y: parseFloat(form.y),
      width: parseFloat(form.width),
      height: parseFloat(form.height),
      style: { opacity: parseFloat(form.opacity) },
    };

    try {
      await createOverlay(payload);
      alert("✅ Overlay created successfully!");
      onOverlayCreated();
      setForm({
        name: "",
        type: "text",
        content: "",
        x: 0.05,
        y: 0.05,
        width: 0.2,
        height: 0.1,
        opacity: 0.9,
      });
    } catch (err) {
      console.error(err);
      alert("❌ Failed to create overlay");
    }
  };

  return (
    <form className="overlay-form" onSubmit={handleSubmit}>
      <h2>Create New Overlay</h2>

      <div className="form-fields">
        <input
          name="name"
          placeholder="Overlay Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <select name="type" value={form.type} onChange={handleChange}>
          <option value="text">📝 Text</option>
          <option value="image">🖼️ Image</option>
        </select>

        <input
          name="content"
          placeholder="Text or Image URL"
          value={form.content}
          onChange={handleChange}
          required
        />

        {/* Updated responsive grid for coordinates */}
        <div className="grid-inputs">
          <input
            name="x"
            type="number"
            step="0.01"
            placeholder="X (0–1)"
            value={form.x}
            onChange={handleChange}
          />
          <input
            name="y"
            type="number"
            step="0.01"
            placeholder="Y (0–1)"
            value={form.y}
            onChange={handleChange}
          />
          <input
            name="width"
            type="number"
            step="0.01"
            placeholder="Width (0–1)"
            value={form.width}
            onChange={handleChange}
          />
          <input
            name="height"
            type="number"
            step="0.01"
            placeholder="Height (0–1)"
            value={form.height}
            onChange={handleChange}
          />
        </div>

        <input
          name="opacity"
          type="number"
          step="0.1"
          placeholder="Opacity (0–1)"
          value={form.opacity}
          onChange={handleChange}
        />

        <button type="submit">➕ Add Overlay</button>
      </div>
    </form>
  );
}

export default OverlayForm;
