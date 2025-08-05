'use client';

import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';

interface VideoBackgroundProps {
    videoUrl: string;
    fallbackImage?: string;
    styles?: string
}

export const VideoBackground = ({ videoUrl, fallbackImage, styles }: VideoBackgroundProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);
    const [isYouTube, setIsYouTube] = useState(false);

    useEffect(() => {
        // Check if it's a YouTube URL
        if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
            setIsYouTube(true);
            return;
        }

        // For local video files or other video sources
        if (videoRef.current) {
            videoRef.current.load();
            // Ensure autoplay and loop are set
            videoRef.current.autoplay = true;
            videoRef.current.loop = true;
            videoRef.current.muted = true;
            videoRef.current.playsInline = true;
        }
    }, [videoUrl]);

    const handleVideoLoad = () => {
        setIsVideoLoaded(true);
    };

    const handleVideoError = () => {
        setIsVideoLoaded(false);
    };

    const handleVideoPlay = () => {
        setIsVideoLoaded(true);
    };

    // For YouTube videos, we'll show a placeholder with the video thumbnail
    if (isYouTube) {
        // Extract video ID from YouTube URL
        const videoId = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
        const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '';

        return (
            <div className="absolute inset-0 overflow-hidden">
                {/* YouTube Thumbnail as Background */}
                {thumbnailUrl && (
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
                        style={{ backgroundImage: `url(${thumbnailUrl})` }}
                    />
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/20" />

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                        <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </div>
                </div>
            </div>
        );
    }

    // For local video files
    return (
        <div className={cn("absolute inset-0 overflow-hidden", styles)}>
            <video
                ref={videoRef}
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover object-center"
                onLoadedData={handleVideoLoad}
                onError={handleVideoError}
                onPlay={handleVideoPlay}
                style={{ opacity: isVideoLoaded ? 1 : 0 }}
            >
                <source src={videoUrl} type="video/mp4" />
                <source src={videoUrl} type="video/webm" />
                <source src={videoUrl} type="video/ogg" />
                Your browser does not support the video tag.
            </video>

            {/* Fallback image if video fails to load */}
            {!isVideoLoaded && fallbackImage && (
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
                    style={{ backgroundImage: `url(${fallbackImage})` }}
                />
            )}

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/5" />
        </div>
    );
}; 