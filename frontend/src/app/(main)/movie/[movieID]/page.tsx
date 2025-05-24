"use client";
import Hls from 'hls.js';
import React, { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation'
import { useSelectedMovie } from '@/lib/hooks/useSelectedMovie';
import { useAuth } from '@/lib/hooks/useAuth';
import { movieCreator } from '@/lib/types/movie';
import { useFetch } from '@/lib/hooks/useFetch';
import { useToast } from '@/hooks/use-toast';
export default function Movie() {
    const { movieID } = useParams<{ movieID: string; }>()
    const { user } = useAuth()
    const { toast } = useToast()
    const router = useRouter()
    const { apiAuthDelete } = useFetch()
    const { userSelectedMovie } = useSelectedMovie(movieID)
    const videoRef = useRef<HTMLVideoElement>(null);
    const [loggedInUser, setLoggedInUser] = useState<movieCreator | null>();

    useEffect(() => {
        async function checkuser() {
            const checkUser = await user()
            setLoggedInUser(checkUser)
        }
        checkuser()
    }, [])

    useEffect(() => {
        const video = videoRef.current;
        if (!video || !userSelectedMovie?.hls_url) return;
        if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(userSelectedMovie.hls_url);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                video.play();
            });
            return () => {
                hls.destroy();
            };
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = userSelectedMovie.hls_url;
            video.addEventListener('loadedmetadata', () => {
                video.play();
            });
        } else {
            console.error('This browser does not support HLS.');
        }
    }, [userSelectedMovie?.hls_url]);

    async function handleDelete() {
        try {
            await apiAuthDelete(`api/movie/${movieID}`)
            toast({
                title: "Success!",
                description: `Your movie ${userSelectedMovie?.title} has been deleted.`,
            })
            router.push("/movie")
        } catch (e) {
            console.error(e)
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "There was a problem with your request.",
            })
        }
    }

    return (
        <>
            <div className="min-h-screen flex flex-col">
                <video ref={videoRef} controls className="w-full max-h-screen object-cover" />
                <div className="p-5 text-white flex flex-col gap-2">
                    <div className='flex flex-row justify-between'>
                        <p className="text-5xl font-semibold">{userSelectedMovie?.title}</p>
                        {
                            userSelectedMovie?.user && loggedInUser?.id && userSelectedMovie.user === loggedInUser.id &&
                            <div className='flex flex-row gap-5'>
                                <button className='border px-5 rounded-lg font-semibold' onClick={() => router.push(`/movie/${userSelectedMovie.id}/update`)}>Update</button>
                                <button className='px-5 rounded-lg font-semibold bg-[#E50914]' onClick={handleDelete}>Delete</button>
                            </div>
                        }
                    </div>
                    <div>
                        {userSelectedMovie?.description}
                    </div>
                </div>
            </div>
        </>
    );
}
