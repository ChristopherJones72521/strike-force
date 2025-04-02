# This script sets up a simple HTTP server that allows Cross-Origin Resource Sharing (CORS) for all origins.
# This is necessary for the web app to access the server from different domains.

from http.server import HTTPServer, SimpleHTTPRequestHandler
import sys

# This class allows Cross-Origin Resource Sharing (CORS) for all origins.
# This is necessary for the web app to access the server from different domains.
class CORSRequestHandler(SimpleHTTPRequestHandler):
    # Add headers to allow CORS
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        SimpleHTTPRequestHandler.end_headers(self)

    # Handle OPTIONS requests for CORS pre-flight requests
    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

# Get the port number from the command line arguments, or use 8080 as the default
port = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
print(f"Starting server on port {port}...")

# Create an HTTP server with the CORS request handler
httpd = HTTPServer(('localhost', port), CORSRequestHandler)

# Start the server and listen for incoming requests
httpd.serve_forever()
