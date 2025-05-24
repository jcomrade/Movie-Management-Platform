export interface MovieDetails {
    id: number;
    hls_url: string;
    user: movieCreator;
    title: string;
    description: string;
    date_added: string;
    original_file: string;
    hls_playlist: string;
    video_file: string;
    status: string;
    thumbnail: string;
    duration: string;
    created_at: string
}

export interface movieCreator {
    id: number;
    username: string;
    email: string;
};