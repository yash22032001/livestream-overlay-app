from flask import Blueprint, request, jsonify
from bson.objectid import ObjectId
import logging
import traceback

bp = Blueprint("overlays", __name__, url_prefix="/api/overlays")

#  Helper function to standardize overlay format
def normalize_overlay(data):
    try:
        return {
            "name": data.get("name", "Overlay"),
            "type": data.get("type", "text"),
            "content": data.get("content", ""),
            "x": float(data.get("x", 0.05)),
            "y": float(data.get("y", 0.05)),
            "width": float(data.get("width", 0.2)),
            "height": float(data.get("height", 0.1)),
            "style": data.get("style", {"color": "#ffffff", "fontSize": 24, "opacity": 0.9}),
        }
    except Exception as e:
        logging.error(f"Error normalizing overlay: {e}")
        raise ValueError("Invalid data types in overlay fields")


def setup_routes(db):
    col = db["overlays"]

    #  GET all overlays (handles both /api/overlays and /api/overlays/)
    @bp.get("")
    @bp.get("/")
    def list_overlays():
        try:
            logging.info("Retrieving overlays")
            items = []
            for doc in col.find({}).sort("_id", -1):
                doc["id"] = str(doc["_id"])
                del doc["_id"]
                items.append(doc)
            return jsonify(items)
        except Exception as e:
            logging.error(f"Error retrieving overlays: {e}\n{traceback.format_exc()}")
            return jsonify({"error": "Failed to fetch overlays"}), 500

    #  POST (create new overlay)
    @bp.post("")
    @bp.post("/")
    def create_overlay():
        try:
            data = request.get_json(force=True)
            logging.info(f"Received create request: {data}")

            ov = normalize_overlay(data)
            res = col.insert_one(ov)

            # Clean response object — deep copy and remove any internal _id
            clean_overlay = {
                "id": str(res.inserted_id),
                "name": ov.get("name"),
                "type": ov.get("type"),
                "content": ov.get("content"),
                "x": ov.get("x"),
                "y": ov.get("y"),
                "width": ov.get("width"),
                "height": ov.get("height"),
                "style": ov.get("style"),
            }

            return jsonify(clean_overlay), 201

        except Exception as e:
            import traceback
            logging.error(f"Error while creating overlay: {e}\n{traceback.format_exc()}")
            return jsonify({"error": str(e)}), 500

    # GET single overlay
    @bp.get("/<id>")
    def get_overlay(id):
        try:
            logging.info(f"Received request to retrieve overlay ID: {id}")
            doc = col.find_one({"_id": ObjectId(id)})
            if not doc:
                return jsonify({"error": "Not found"}), 404
            doc["id"] = str(doc["_id"])
            del doc["_id"]
            return jsonify(doc)
        except Exception as e:
            logging.error(f"Error while retrieving overlay: {e}\n{traceback.format_exc()}")
            return jsonify({"error": "Invalid id"}), 400

    #  PUT (update overlay)
    @bp.put("/<id>")
    def update_overlay(id):
        try:
            data = request.get_json(force=True)
            logging.info(f"Received update request for ID {id}: {data}")
            ov = normalize_overlay(data)
            res = col.find_one_and_update(
                {"_id": ObjectId(id)},
                {"$set": ov},
                return_document=True,
            )
            if not res:
                return jsonify({"error": "Not found"}), 404
            res["id"] = str(res["_id"])
            del res["_id"]
            return jsonify(res)
        except Exception as e:
            logging.error(f"Error while updating overlay: {e}\n{traceback.format_exc()}")
            return jsonify({"error": "Invalid id"}), 400

    #  DELETE overlay
    @bp.delete("/<id>")
    def delete_overlay(id):
        try:
            res = col.delete_one({"_id": ObjectId(id)})
            if res.deleted_count == 0:
                return jsonify({"error": "Not found"}), 404
            return jsonify({"ok": True})
        except Exception as e:
            logging.error(f"Error while deleting overlay: {e}\n{traceback.format_exc()}")
            return jsonify({"error": "Invalid id"}), 400

    return bp
