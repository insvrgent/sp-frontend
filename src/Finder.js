import React, { useEffect, useState } from "react";
import './Music.css';
import TrackDetails from "./TrackDetails";
import io from 'socket.io-client';

const socket = io('http://localhost:5000'); 


const App = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [songData, setSongData] = useState([]);

    useEffect(() => {
        // Listen for "search" event from backend
        socket.on('search', (searchTerm) => {
            const accessToken = sessionStorage.getItem("accessToken");
            if (searchTerm !== '' && accessToken) {
                fetch(
                    `https://api.spotify.com/v1/search?q=${searchTerm}&type=track&limit=5`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                )
                    .then((response) => response.json())
                    .then((data) => {
                        // Emit "searchResult" event with the result
                        socket.emit('searchResult', data.tracks.items);
                    })
                    .catch((error) => {
                        console.error("Error fetching tracks:", error);
                    });
            }
        });

        return () => {
            socket.off('search'); // Cleanup socket event listener
        };
    }, []); // Only run once on component mount

    useEffect(() => {
        const accessToken = sessionStorage.getItem("accessToken");
        if (searchTerm !== '' && accessToken) {
            fetch(
                `https://api.spotify.com/v1/search?q=${searchTerm}&type=track&limit=5`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            )
                .then((response) => response.json())
                .then((data) => {
                    setSongData(data.tracks.items);
                })
                .catch((error) => {
                    console.error("Error fetching tracks:", error);
                });
        }
    }, [searchTerm]);

    useEffect(() => {
        const refreshToken = () => {
            const refreshToken = sessionStorage.getItem("refreshToken");
            if (refreshToken) {
                // Fetch new access token using the refresh token
                fetch("http://localhost:5000/refresh_token", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ refresh_token: refreshToken }),
                })
                    .then((response) => response.json())
                    .then((data) => {
                        sessionStorage.setItem("accessToken", data.access_token);
                        console.log(data.access_Token);
                    })
                    .catch((error) => {
                        console.error("Error refreshing token:", error);
                    });
            }
        };

        // Refresh token every 1 hour
        const intervalId = setInterval(refreshToken, 60 * 10 * 1000); // 3600000 ms = 1 hour

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div>
            <div>
                <h3>find & request spotify music here</h3>
                <div className="canvas-container">
                    <div className="input-bar">
                        <img src="find-logo.png" alt="Find" className="find-logo" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={handleSearch}
                            placeholder="Search..."
                            className="search-input"
                        />
                    </div>
                    <div className="items-container">
                        {searchTerm !== '' ? (
                            songData.map((track, index) => (
                                <TrackDetails key={index} track={track} isQueue={false} />
                            ))
                        ) : (
                            songData.map((track, index) => (
                                <TrackDetails key={index} track={track} isQueue={true} />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div >
    );
};

export default App;
