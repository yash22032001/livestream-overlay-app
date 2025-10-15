import { useEffect, useState } from "react";
import { getOverlays, deleteOverlay } from "./services/api";
import VideoPlayer from "./components/VideoPlayer";
import OverlayForm from "./components/OverlayForm";
import OverlayItem from "./components/OverlayItem";

function App() {
  const [overlays, setOverlays] = useState([]);

  const fetchOverlays = () => {
    getOverlays()
      .then((res) => setOverlays(res.data))
      .catch((err) => console.error("API error:", err));
  };

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    fetchOverlays();
  }, []);


  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this overlay?")) return;
    try {
      await deleteOverlay(id);
      alert("Overlay deleted!");
      fetchOverlays();
    } catch (err) {
      console.error(err);
      alert("Failed to delete overlay");
    }
  };

  const streamUrl = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center", 
      justifyContent: "center", 
      backgroundColor: "#f9f9f9", 
      fontFamily: "Poppins, sans-serif",
      padding: "20px",
      width: "100vw",

    }}>
      <h1>🎥 Livestream Overlay Dashboard</h1>

      <VideoPlayer
        streamUrl={streamUrl}
        overlays={overlays}
        onOverlayUpdated={fetchOverlays}
      />

      <OverlayForm onOverlayCreated={fetchOverlays} />

      <h3 style={{ marginTop: "40px" }}>Available Overlays:</h3>
      {overlays.length === 0 ? (
        <p>No overlays found.</p>
      ) : (

        <ul>
          {overlays.map((ov) => (
            <OverlayItem key={ov.id} overlay={ov} onUpdated={fetchOverlays} />
          ))}
        </ul>

      )}
    </div>
  );
}

export default App;
