from flask import Flask, request, jsonify
from yt_dlp import YoutubeDL
import os
import logging
import requests
import random
import time
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
allowed_origins = [
    "https://audiosync-liard.vercel.app",
    "https://audiosync-backend.vercel.app",
    "http://localhost:5000",  # For local development
]

CORS(app, resources={r"/*": {"origins": allowed_origins}}, supports_credentials=True)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# Utility
def get_proxy():
    """Fetch a proxy address from proxyscrape"""
    try:
        response = requests.get("https://api.proxyscrape.com/v2/?request=getproxies&protocol=http&timeout=10000&country=all")
        proxies = response.text.splitlines()
        if proxies:
            return proxies[-1] # Last available proxy
    except Exception as e:
        print(f"Error fetching proxy: {e}")
    return None

def test_proxy(proxy):
    """Tests if the proxy is responsive within a timeout"""
    start_time = time.time()
    try:
        response = requests.get("https://www.google.com", proxies={"http": proxy}, timeout=5)
        response.raise_for_status()
        duration = time.time() - start_time
        return duration
    except requests.RequestException:
        return None


@app.route('/api/v1/get-yt-song', methods=['GET'])
def get_youtube_song():
    """
    Get YouTube song URLs based on search parameters
    Query params:
    - song_title: TItle of the song
    - artist_name: Name of the artist performing the song
    - video_id: YouTube video ID (takes precedence if provided)
    """
    
    try:
        song_title = request.args.get('song_title', '')
        artist_name = request.args.get('artist_name', '')
        video_id = request.args.get('video_id', '')
        
        #Search either by video id or by artist_name + song_title
        search_query = video_id if video_id else f"{artist_name} {song_title}".strip()
        
        logger.info(f"Searching for {search_query}")
        
        # First, get the video info
        search_options = {
            'quiet': True,
            'no_warnings': True,
            'noplaylist': True,
            'skip_download': True,
            'extract_flat': True,
        }
        
        with YoutubeDL(search_options) as ydl:
            search_results = ydl.extract_info(f"ytsearch1:{search_query}", download=False)
            
            if not search_results or 'entries' not in search_results or len(search_results['entries']) == 0:
                return jsonify({"error": f"No video results found for '{search_query}'"}), 404
            
            # Get the first result
            video = search_results['entries'][0]
            video_url = f"https://www.youtube.com/watch?v={video['id']}"
            video_id = video['id']
            logger.info(f"Found video: {video.get('title', 'Unknown')} ({video_url})")
            
            proxy_address = get_proxy()
            
            # Test the proxy's speed
            if proxy_address:
                test_duration = test_proxy('http://' + proxy_address)
                if test_duration and test_duration < 2:  # Only use fast proxies
                    logger.info(f"Using proxy: {proxy_address} (Response time: {test_duration:.2f}s)")
                else:
                    logger.warning(f"Proxy {proxy_address} is slow or failed, not using proxy.")
                    proxy_address = None  # Discard slow proxy
            
            # Now get the direct audio URL with different options
            audio_options = {
                'quiet': True,
                'no_warnings': True,
                'format': 'bestaudio/best',
                'noplaylist': True,
                'skip_download': True,
                'youtube_include_dash_manifest': False,  # Don't include DASH manifests
                'prefer_free_formats': True,
                'outtmpl': '%(id)s.%(ext)s',
                # bot evasion
                'user_agent': random.choice([
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36',
                    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36'
                ]),
                'headers': {
                    'Accept-Language': random.choice(['en-US,en;q=0.9', 'en-GB,en;q=0.9']),
                    'Referer': 'https://www.youtube.com/',
                    'Origin': 'https://www.youtube.com'
                }
            }
            
            # if proxy_address:
            #     audio_options['proxy'] = 'http://' + proxy_address
            # else:
            #     audio_options['proxy'] = ''
            
            with YoutubeDL(audio_options) as ydl:
                audio_info = ydl.extract_info(video_url, download=False)
                
                # Get the best audio format URL that's not a manifest
                for format in audio_info.get('formats', []):
                    if (format.get('acodec') != 'none' and 
                        format.get('vcodec') == 'none' and 
                        not format.get('url', '').endswith('.m3u8') and
                        not 'manifest' in format.get('url', '')):
                        
                        return jsonify({
                            "audio_url": format['url'],
                            "video_url": video_url,
                            "title": audio_info.get('title', ''),
                            "duration": audio_info.get('duration', 0)
                        })
                
                # Fallback: Try to get any direct URL
                for format in audio_info.get('formats', []):
                    if (not format.get('url', '').endswith('.m3u8') and
                        not 'manifest' in format.get('url', '')):
                        
                        return jsonify({
                            "audio_url": format['url'],
                            "video_url": video_url,
                            "title": audio_info.get('title', ''),
                            "duration": audio_info.get('duration', 0)
                        })
                
                # Last resort fallback
                return jsonify({
                    "audio_url": audio_info.get('url', ''),
                    "video_url": video_url,
                    "title": audio_info.get('title', ''),
                    "duration": audio_info.get('duration', 0)
                })
            
    except Exception as e:
        logger.error(f"Error: {str(e)}")
        return jsonify({"error": f"Failed to fetch song audio URL: {str(e)}"}), 500

@app.route('/', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "service": "YouTube Audio API"}), 200

# For local testing
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 2000))
    app.run(debug=True, host="0.0.0.0", port=port)
         
