import os
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
from overlays import setup_routes
import logging

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
PORT = int(os.getenv("PORT", 5001))
HLS_DIR = os.path.abspath(os.getenv("HLS_DIR", "hls"))

app = Flask(__name__)

#  FIXED CORS configuration (full support for React frontend)
CORS(
    app,
    resources={
        r"/api/*": {
            "origins": [
                "http://localhost:5173",
                "http://127.0.0.1:5173",
                "https://livestream-overlay.netlify.app"  #  Netlify frontend
            ]
        }
    },
    supports_credentials=True,
)

#  MongoDB connection
client = MongoClient(MONGO_URI)
db = (
    client.get_default_database()
    if "/" in MONGO_URI.split("//")[-1]
    else client["overlaydb"]
)

#  Register Blueprint without trailing slashes
app.register_blueprint(setup_routes(db))

@app.route("/")
def home():
    return jsonify({"message": "Backend connected with MongoDB successfully!"})


@app.route("/stream/<path:filename>")
def stream_files(filename):
    return send_from_directory(HLS_DIR, filename, conditional=True)


#  Logging setup (console + file)
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[logging.StreamHandler(), logging.FileHandler("app.log")],
)
logging.info("App started and logging initialized!")


if __name__ == "__main__":
    os.makedirs(HLS_DIR, exist_ok=True)
    port = int(os.environ.get("PORT", 5001))
    app.run(host="0.0.0.0", port=port, debug=True)

