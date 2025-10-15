import { useEffect, useRef, useState } from "react";
import { Rnd } from "react-rnd";
import Hls from "hls.js";
import { updateOverlay } from "../services/api";

function VideoPlayer({ streamUrl, overlays, onOverlayUpdated }) {
  const videoRef = useRef(null);
  const [editing, setEditing] = useState(true);

  //  Initialize video playback using hls.js
  useEffect(() => {
    const video = videoRef.current;
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = streamUrl;
    }
  }, [streamUrl]);

  const VIDEO_WIDTH = 900;
  const VIDEO_HEIGHT = 500;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: `${VIDEO_WIDTH}px`,
        margin: "0 auto",
      }}
    >
      {/*  Video */}
      <video
        ref={videoRef}
        controls
        autoPlay
        muted
        style={{
          width: "100%",
          height: "auto",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
          backgroundColor: "black",
        }}
      />

      {/*  Edit Mode Toggle */}
      <button
        onClick={() => setEditing((prev) => !prev)}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          background: editing ? "#28a745" : "#007bff",
          color: "white",
          border: "none",
          borderRadius: "6px",
          padding: "6px 10px",
          cursor: "pointer",
          fontWeight: "600",
          zIndex: 1000,
        }}
      >
        {editing ? "✅ Editing Mode" : "▶️ View Mode"}
      </button>

      {/*  Overlays */}
      {overlays.map((ov, index) => {
        
        const gap = 5; 
        const offsetX = (index % 4) * gap; 
        const offsetY = Math.floor(index / 4) * gap; 
        const startX = Math.min(ov.x * VIDEO_WIDTH + offsetX, VIDEO_WIDTH - gap);
        const startY = Math.min(ov.y * VIDEO_HEIGHT + offsetY, VIDEO_HEIGHT - gap);

        return (
          <Rnd
            key={ov.id}
            default={{
              x: startX,
              y: startY,
              width: ov.width * VIDEO_WIDTH,
              height: ov.height * VIDEO_HEIGHT,
            }}
            bounds="parent"
            enableResizing={editing}
            disableDragging={!editing}
            onDragStop={(e, d) => {
              if (!editing) return;
              const newX = d.x / VIDEO_WIDTH;
              const newY = d.y / VIDEO_HEIGHT;
              updateOverlay(ov.id, { ...ov, x: newX, y: newY });
              onOverlayUpdated?.();
            }}
            onResizeStop={(e, direction, ref, delta, position) => {
              if (!editing) return;
              const newWidth = ref.offsetWidth / VIDEO_WIDTH;
              const newHeight = ref.offsetHeight / VIDEO_HEIGHT;
              const newX = position.x / VIDEO_WIDTH;
              const newY = position.y / VIDEO_HEIGHT;
              updateOverlay(ov.id, {
                ...ov,
                x: newX,
                y: newY,
                width: newWidth,
                height: newHeight,
              });
              onOverlayUpdated?.();
            }}
            style={{
              pointerEvents: editing ? "auto" : "none",
              zIndex: 999,
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                background: "rgba(0,0,0,0.5)",
                color: "#00bfff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                textAlign: "center",
                borderRadius: "14px",
                textShadow: "1px 1px 3px rgba(0,0,0,0.9)",
                boxShadow: "0 6px 15px rgba(0,0,0,0.5)",
                cursor: editing ? "move" : "default",
                userSelect: "none",
                padding: "8px",
                transition: "all 0.25s ease",
              }}
            >
              {ov.type === "text" ? (
                <span>{ov.content}</span>
              ) : (
                <img
                  src={ov.content}
                  alt={ov.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    borderRadius: "10px",
                    pointerEvents: "none",
                  }}
                />
              )}
            </div>
          </Rnd>
        );
      })}
    </div>
  );
}

export default VideoPlayer;
