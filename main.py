"""
KrishiMitra AI - Main Entry Point
For Render deployment
"""
import os
import sys

# Ensure backend is in path
print("--- STARTING KRISHIMITRA API PROXY ---")
root_dir = os.path.dirname(os.path.abspath(__file__))
backend_path = os.path.join(root_dir, 'backend')
print(f"Root dir: {root_dir}")
print(f"Adding to sys.path: {backend_path}")

if backend_path not in sys.path:
    sys.path.insert(0, backend_path)

# Now import the app
print("Attempting to import app.main...")
try:
    from app.main import app as main_app
    print("App import successful")
    app = main_app
except Exception as e:
    print(f"FAILED TO IMPORT APP: {str(e)}")
    import traceback
    traceback.print_exc()
    raise

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=port,
        reload=False,
    )