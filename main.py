"""
KrishiMitra AI - Main Entry Point
For Render deployment
"""
import os
import sys

# Ensure backend is in path
backend_path = os.path.join(os.path.dirname(__file__), 'backend')
if backend_path not in sys.path:
    sys.path.insert(0, backend_path)

# Change to backend directory for relative paths
os.chdir(backend_path)

# Now import the app
from app.main import app

# Expose app for gunicorn/uvicorn
app = app

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=port,
        reload=False,
    )