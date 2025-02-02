import  { useState, useEffect } from "react";
import axios, { AxiosError } from "axios"; // Import AxiosError
import Cookies from "js-cookie";
import "./style/jokes.css";
import { useNavigate } from "react-router-dom";

interface Joke {
    _id: string;
    text: string;
    likes: number;
    dislikes: number;
}

const API = 'https://jokesgeneratorapi.onrender.com';

function JokesPage() {
    const [jokes, setJokes] = useState<Joke[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchJokes = async () => {
            try {
                const response = await axios.get<Joke[]>(`${API}/jokes`); // Type the response data
                setJokes(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching jokes:", error);
                setLoading(false);
            }
        };

        fetchJokes();
    }, []);

    const handleLike = async () => {
        await handleInteraction("like");
    };

    const handleDislike = async () => {
        await handleInteraction("dislike");
    };

    const handleSkip = () => {
        handleInteraction("skip");
    };

    const handleInteraction = async (interaction: string) => { // Type the interaction parameter
        if (!jokes[currentIndex]) return; // Guard against undefined jokes[currentIndex]

        const currentJoke = jokes[currentIndex];

        const interactions = JSON.parse(Cookies.get("jokeInteractions") || "{}");
        interactions[currentJoke._id] = interaction;
        Cookies.set("jokeInteractions", JSON.stringify(interactions), { expires: 7 });

        if (interaction !== "skip") {
            try {
                await axios.post(`${API}/jokes/${currentJoke._id}/react`, { reaction: interaction });

                const updatedJokes = [...jokes];
                if (interaction === "like") {
                    updatedJokes[currentIndex].likes += 1;
                } else if (interaction === "dislike") {
                    updatedJokes[currentIndex].dislikes += 1;
                }
                setJokes(updatedJokes);
            } catch (error: unknown) { // Type the error
                console.error(`Error sending ${interaction} to the backend:`, error);

                if (error instanceof AxiosError) { // Use type guard
                    console.error("Axios Error Details:", error.response?.data || error.message); // Log more details
                } else if (error instanceof Error) {
                    console.error("Standard Error Details:", error.message);
                }

            }
        }

        if (currentIndex < jokes.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            setShowModal(true);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        navigate("/");
    };

    if (loading) {
        return <div>Loading jokes...</div>;
    }

    // Guard against undefined jokes[currentIndex] *after* loading check
    if (!jokes[currentIndex]) {
        return <div>No jokes available.</div>; // Or a more appropriate message
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
