"use client";

import { ToastContainer , toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Share, Play, ThumbsUp, ThumbsDown, LogOut } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { signOut } from "next-auth/react";
import YouTube from "react-youtube";
import { YT_REGEX } from "../lib/utils";

const creatorId = "1e5e4f9f-20e3-4e0d-ad9c-3944d3a6155c ";

interface Song {
  id: string;
  title: string;
  thumbnail: string;
  upvotes: number;
  haveUpvoted: boolean;
}

export default function Dashboard() {
  const { data: session } = useSession();
  const [youtubeLink, setYoutubeLink] = useState("");
  const [videoId, setVideoId] = useState<string | null>(null);
  const [nowPlaying, setNowPlaying] = useState<Song | null>(null);
  const [upcomingSongs, setUpcomingSongs] = useState<Song[]>([]);

  const REFRESH_INTERVAL_MS = 10 * 1000;

  // Fetch streams from backend
  async function refreshStreams() {
    if (!session?.user?.id) return;

    try {
      const res = await axios.get(`/api/streams?creatorId=${session.user.id}`, {
        withCredentials: true,
      });

      console.log("Fetched streams:", res.data.streams);

      if (res.data?.streams?.length > 0) {
        setNowPlaying({
          id: res.data.streams[0].id,
          title: res.data.streams[0].title,
          thumbnail: res.data.streams[0].smallImg || "/placeholder.svg",
          upvotes: res.data.streams[0].upvote ?? 0,
          haveUpvoted: false,
        });

        setUpcomingSongs(
          res.data.streams.slice(1).map((stream: any) => ({
            id: stream.id,
            title: stream.title,
            thumbnail: stream.smallImg || "/placeholder.svg",
            upvotes: stream.upvote ?? 0,
            haveUpvoted: false,
          }))
        );
      } else {
        setNowPlaying(null);
        setUpcomingSongs([]);
      }
    } catch (error) {
      console.error("Failed to refresh streams:", error);
    }
  }

  useEffect(() => {
    refreshStreams(); // Initial load
    const interval = setInterval(refreshStreams, REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [session?.user?.id]);

  // Handle adding to queue
  const handleAddToQueue = async () => {
    if (!videoId) {
      alert("Please enter a valid YouTube link!");
      return;
    }

    if (!session?.user?.id) {
      alert("You need to be logged in to add a song!");
      return;
    }

    try {
      const response = await fetch("/api/streams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creatorId: session.user.id,
          url: youtubeLink,
        }),
      });

      if (!response.ok) throw new Error("Failed to add song to queue");

      await refreshStreams();
      setYoutubeLink("");
      setVideoId(null);
    } catch (error) {
      console.error("Error adding song to queue:", error);
      alert("Failed to add song to queue. Please try again.");
    }
  };

  // Handle play next
  const handlePlayNext = () => {
    if (upcomingSongs.length === 0) {
      alert("No more songs in the queue!");
      return;
    }

    setNowPlaying(upcomingSongs[0]);
    setUpcomingSongs(upcomingSongs.slice(1));
  };

  const handleShare = () => {
    const shareableLink = `${window.location.hostname}/creator/${creatorId}`; // Get the current URL
    navigator.clipboard
      .writeText(shareableLink) // Copy the URL to the clipboard
      .then(() => {
        toast.success("Link copied to clipboard!"); // Show success toast
      })
      .catch(() => {
        toast.error("Failed to copy link. Please try again."); // Show error toast if copying fails
      });
  };

  // Handle upvote/downvote
  const handleVote = async (songId: string, isUpvote: boolean) => {
    try {
      // Optimistically update the local state
      setUpcomingSongs((prev) =>
        prev
          .map((song) =>
            song.id === songId
              ? {
                  ...song,
                  upvotes: isUpvote ? song.upvotes + 1 : song.upvotes,
                  haveUpvoted: !song.haveUpvoted,
                }
              : song
          )
          .sort((a, b) => b.upvotes - a.upvotes)
      );

      // Send the upvote request to the backend
      const response = await fetch("/api/streams/upvote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ streamId: songId }),
      });

      // Log the response for debugging
      const responseData = await response.json();
      console.log("Upvote response:", responseData);

      // If the request fails, throw an error
      if (!response.ok) {
        throw new Error(responseData.message || "Failed to upvote");
      }

      // Refresh the streams to ensure the UI is in sync with the database
      await refreshStreams();
    } catch (error) {
      console.error("Error while upvoting:", error);

      // Revert the local state if the request fails
      setUpcomingSongs((prev) =>
        prev
          .map((song) =>
            song.id === songId
              ? {
                  ...song,
                  upvotes: isUpvote ? song.upvotes - 1 : song.upvotes,
                  haveUpvoted: !song.haveUpvoted,
                }
              : song
          )
          .sort((a, b) => b.upvotes - a.upvotes)
      );

      alert( "Failed to upvote. Please try again.");
    }
  };

  // Extract video ID from YouTube URL
  useEffect(() => {
    const match = youtubeLink.match(YT_REGEX);
    if (match) {
      setVideoId(match[1]); // Extract the video ID from the URL
    } else {
      setVideoId(null); // Reset the video ID if the URL is invalid
    }
  }, [youtubeLink]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black p-4">
      <div className="w-full max-w-4xl">
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white">Song Voting Queue</h1>
            <div className="flex gap-4">
              <Button className="bg-purple-600 hover:bg-purple-700" onClick={handleShare}>
                <Share className="mr-2 h-4 w-4" />
                Share
              </Button>
              <Button onClick={() => signOut({ callbackUrl: "/" })} className="bg-purple-600 hover:bg-purple-700">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>

          {/* Add to Queue */}
          <Input
            placeholder="Paste YouTube link here"
            value={youtubeLink}
            onChange={(e) => setYoutubeLink(e.target.value)}
            className="bg-gray-800 border-none text-white"
          />
          <Button onClick={handleAddToQueue} className="w-full bg-purple-600 hover:bg-purple-700">
            Add to Queue
          </Button>

          {/* Video Preview */}
          {videoId && (
            <div className="mt-4">
              <h2 className="text-xl font-bold text-white mb-2">Video Preview</h2>
              <Card>
                <CardContent className="p-4">
                  <YouTube videoId={videoId} />
                </CardContent>
              </Card>
            </div>
          )}

          {/* Now Playing */}
          {nowPlaying && (
            <div>
              <h2 className="text-xl font-bold text-white mb-2">Now Playing</h2>
              <Card>
                <CardContent>
                  <YouTube videoId={nowPlaying.id} />
                </CardContent>
              </Card>

              {/* Play Next Button */}
              {upcomingSongs.length > 0 && (
                <Button onClick={handlePlayNext} className="mt-4 w-full bg-purple-600 hover:bg-purple-700">
                  <Play className="mr-2 h-4 w-4" />
                  Play Next
                </Button>
              )}
            </div>
          )}

          {/* Upcoming Songs */}
          {upcomingSongs.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-bold text-white mb-2">Upcoming Songs</h2>
              {upcomingSongs.map((song) => (
                <div key={song.id} className="flex items-center justify-between bg-gray-900 p-4 rounded mb-2">
                  <div className="flex items-center gap-4">
                    <img src={song.thumbnail} alt={song.title} className="w-12 h-12 object-cover" />
                    <span className="text-white">{song.title}</span>
                  </div>
                  <Button
                    onClick={() => handleVote(song.id, true)}
                    disabled={song.haveUpvoted} // Disable the button if the user has already upvoted
                    className={song.haveUpvoted ? "bg-gray-600 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"}
                  >
                    <ThumbsUp className="mr-2 h-4 w-4" />
                    {song.upvotes}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
        <ToastContainer />
      </div>
    </main>
  );
}