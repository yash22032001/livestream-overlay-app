import { useState } from "react";
import { createOverlay } from "../services/api";

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
      alert(" Overlay created successfully!");
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
      alert(" Failed to create overlay");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: "linear-gradient(135deg, #f9f9f9, #eef6ff)",
        padding: "25px 30px",
        borderRadius: "16px",
        margin: "20px auto",
        boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
        width: "70%",
        maxWidth: "500px",
        transition: "transform 0.2s ease",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          color: "#003366",
          marginBottom: "20px",
          fontWeight: "700",
        }}
      >
         Create New Overlay
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input
          name="name"
          placeholder="Overlay Name"
          value={form.name}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <select name="type" value={form.type} onChange={handleChange} style={inputStyle}>
          <option value="text">📝 Text</option>
          <option value="image">🖼️ Image</option>
        </select>

        <input
          name="content"
          placeholder="Text or Image URL"
          value={form.content}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "10px",
          }}
        >
          <input name="x" type="number" step="0.01" placeholder="X (0–1)" value={form.x} onChange={handleChange} style={inputStyle} />
          <input name="y" type="number" step="0.01" placeholder="Y (0–1)" value={form.y} onChange={handleChange} style={inputStyle} />
          <input name="width" type="number" step="0.01" placeholder="Width (0–1)" value={form.width} onChange={handleChange} style={inputStyle} />
          <input name="height" type="number" step="0.01" placeholder="Height (0–1)" value={form.height} onChange={handleChange} style={inputStyle} />
        </div>

        <input
          name="opacity"
          type="number"
          step="0.1"
          placeholder="Opacity (0–1)"
          value={form.opacity}
          onChange={handleChange}
          style={inputStyle}
        />

        <button
          type="submit"
          style={{
            padding: "12px",
            background: "linear-gradient(135deg, #007bff, #0056b3)",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "600",
            transition: "background 0.3s ease, transform 0.2s ease",
          }}
          onMouseOver={(e) => (e.target.style.background = "linear-gradient(135deg, #0056b3, #003d80)")}
          onMouseOut={(e) => (e.target.style.background = "linear-gradient(135deg, #007bff, #0056b3)")}
        >
          ➕ Add Overlay
        </button>
      </div>
    </form>
  );
}

const inputStyle = {
  padding: "10px 12px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  outline: "none",
  transition: "all 0.2s ease",
  fontSize: "0.95rem",
  fontWeight: "500",
  color: "#333",
  backgroundColor: "white",
};

export default OverlayForm;
