import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import "./style/Add.css";
import { useNavigate } from "react-router-dom";


const API = 'https://jokesgeneratorapi.onrender.com'
function Add() {
    const [jokeText, setJokeText] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [formVisible, setFormVisible] = useState(true); // State for form visibility
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = Cookies.get("token");
            const headers = token ? { Authorization: `Bearer ${token}` } : {};

            const response = await axios.post(`${API}/jokes`, {
                text: jokeText,
            }, headers);

            console.log("Joke submitted successfully:", response.data);
            setJokeText("");
            setFormVisible(false); // Hide the form
            setShowModal(true);

        } catch (error) {
            console.error("Error submitting joke:", error);
            if (error.response) {
                alert(error.response.data.message);
            } else {
                alert("An error occurred while submitting the joke.");
            }
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setFormVisible(true); // Show the form again (if needed)
        navigate("/");
    };

    return (
        <div id="container">
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>تم إضافة النكتة، شكراً على مشاركتك ♡</h2>
                        <button className="btn" onClick={handleCloseModal}>الرئيسية</button>
                    </div>
                </div>
            )}
            {formVisible && ( // Conditionally render the form
                <div> {/* Added a wrapping div for better control */}
                    <h1>أضف نكتة</h1>
                    <form onSubmit={handleSubmit}>
                        <textarea
                            className="add-joke-textarea"
                            id="jokeText"
                            value={jokeText}
                            onChange={(e) => setJokeText(e.target.value)}
                            placeholder="أدخل النكتة هنا..."
                            rows="5"
                            required
                        />
                        <div></div>
                        <button className="add-joke-button" type="submit">أرسل النكتة</button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default Add;