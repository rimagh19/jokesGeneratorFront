import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import "./style/jokes.css";
import { useNavigate } from "react-router-dom";
const API = 'https://jokesgeneratorapi.onrender.com'
function JokesPage() {
  const [jokes, setJokes] = useState([]); // Holds jokes from the database
  const [currentIndex, setCurrentIndex] = useState(0); // Tracks current joke index
  const [loading, setLoading] = useState(true); // Tracks loading state
  const [showModal, setShowModal] = useState(false); // Tracks modal visibility
  const navigate = useNavigate();

  // Fetch jokes from the server
  useEffect(() => {
    const fetchJokes = async () => {
      try {
        const response = await axios.get(`${API}/jokes`);
        setJokes(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching jokes:", error);
        setLoading(false);
      }
    };

    fetchJokes();
  }, []);

  // Handle like button click
  const handleLike = async () => {
    await handleInteraction("like");
  };

  // Handle dislike button click
  const handleDislike = async () => {
    await handleInteraction("dislike");
  };

  // Handle skip button click
  const handleSkip = () => {
    handleInteraction("skip");
  };

  // Record interaction, update backend, and move to the next joke
  const handleInteraction = async (interaction) => {
    const currentJoke = jokes[currentIndex];

    // Save interaction to cookies
    const interactions = JSON.parse(Cookies.get("jokeInteractions") || "{}");
    interactions[currentJoke._id] = interaction;
    Cookies.set("jokeInteractions", JSON.stringify(interactions), { expires: 7 });

    // Send interaction to the backend
    if (interaction !== "skip") {
      try {
        await axios.post(`${API}/jokes/${currentJoke._id}/react`, { reaction: interaction });

        // Update local joke data with incremented count
        const updatedJokes = [...jokes];
        if (interaction === "like") {
          updatedJokes[currentIndex].likes += 1;
        } else if (interaction === "dislike") {
          updatedJokes[currentIndex].dislikes += 1;
        }
        setJokes(updatedJokes);
      } catch (error) {
        console.error(`Error sending ${interaction} to the backend:`, error);
      }
    }

    // Move to the next joke
    if (currentIndex < jokes.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowModal(true); // Show the modal when all jokes are rated
    }
  };

  // Close the modal and redirect to the main route
  const handleCloseModal = () => {
    setShowModal(false);
    navigate("/"); // Redirect to the main route
  };

  if (loading) {
    return <div>Loading jokes...</div>;
  }

  const currentJoke = jokes[currentIndex];

  return (
    <div id="container">
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>خلصت النكت، شكراً على مشاركتك ♡</h2>
            <button className="btn" onClick={handleCloseModal}>الرئيسية</button>
          </div>
        </div>
      )}

      {!showModal && (
        <>
          <div id="jokesHolder">
            <div id="imgHolder">
              <img id="stars" src="/stars.png" alt="stars" />
            </div>
            <p>{currentJoke.text}</p>
          </div>
          <div id="ratingHolder">
            <button className="btn" onClick={handleLike}>
              أعجبتني {`(${currentJoke.likes})`}
            </button>
            <button className="btn" onClick={handleDislike}>
              بايخة {`(${currentJoke.dislikes})`}
            </button>
            <div>
              <button id="skip" onClick={handleSkip}><u>تــخــطي</u></button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default JokesPage;
