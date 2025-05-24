import os
from celery import shared_task
import subprocess
from django.conf import settings

from .models import MovieItem

@shared_task
def process_video_task(video_id):
    video = MovieItem.objects.get(id=video_id)
    video_path = video.original_file.path

    # Generate HLS
    hls_output_path = video_path.replace(".mp4", ".m3u8")
    hls_folder = os.path.dirname(hls_output_path)

    os.makedirs(hls_folder, exist_ok=True)

    cmd = [
        'ffmpeg',
        '-i', video_path,
        '-c:v', 'copy',
        '-start_number', '0',
        '-hls_time', '10',
        '-hls_list_size', '0',
        '-f', 'hls',
        hls_output_path
    ]
    subprocess.run(cmd, check=True)
    
    # Generate thumbnail at 5 seconds
    thumbnail_folder = os.path.join(settings.MEDIA_ROOT, 'thumbnails')
    os.makedirs(thumbnail_folder, exist_ok=True)
    
    thumbnail_filename = f"thumb_{video.id}.jpg"
    thumbnail_path = os.path.join(thumbnail_folder, thumbnail_filename)
    
    thumb_cmd = [
        'ffmpeg',
        '-ss', '00:00:05',  # seek to 5 seconds
        '-i', video_path,
        '-frames:v', '1',
        '-q:v', '2',  # quality level (1-31, lower is better)
        thumbnail_path
    ]
    subprocess.run(thumb_cmd, check=True)

    video.hls_playlist.name = hls_output_path.replace(settings.MEDIA_ROOT + '/', '')
    video.thumbnail.name = f"thumbnails/{thumbnail_filename}"
    video.status = 'processed'
    video.save()
