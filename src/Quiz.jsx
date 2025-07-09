import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Quiz.css';
import Quiz2 from './Quiz2.jsx'; // ✅ Correct import

const categories = [
  { id: 9, name: "General Knowledge" },
  { id: 23, name: "History" },
  { id: 18, name: "Science: Computers" },
  { id: 30, name: "Science: Gadgets" },
  { id: 17, name: "Science & Nature" },
];

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [error, setError] = useState(null);
  const [showQuiz2, setShowQuiz2] = useState(false); // ✅ Optional toggle

  useEffect(() => {
    const fetchQuestions = async () => {
      if (selectedCategory === null) return;

      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `https://opentdb.com/api.php?amount=10&category=${selectedCategory}&difficulty=medium&type=multiple`
        );
        setQuestions(response.data.results);
        setCurrentQuestion(0);
        setScore(0);
        setShowScore(false);
      } catch (error) {
        console.error("Error fetching questions: ", error);
        setError("Failed to load questions. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [selectedCategory]);

  const handleAnswerClick = (selectedAnswer) => {
    const correctAnswer = questions[currentQuestion].correct_answer;
    if (selectedAnswer === correctAnswer) {
      setScore(score + 1);
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowScore(true);
    }
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  // === Category Selection ===
  if (selectedCategory === null) {
    return (
      <div className="category-selection">
        <h2>Select a Quiz Category</h2>
        {categories.map((cat) => (
          <button key={cat.id} onClick={() => handleCategorySelect(cat.id)}>
            {cat.name}
          </button>
        ))}
      </div>
    );
  }

  // === Loading or Error State ===
  if (loading || questions.length === 0) {
    return (
      <div className="loading-section">
        {error ? <p>{error}</p> : <p>Loading questions...</p>}
      </div>
    );
  }

  // === Show Final Score ===
  if (showScore) {
    return (
      <div className="score-section">
        <h2>You scored {score} out of {questions.length}!</h2>
        <button onClick={() => setSelectedCategory(null)}>Play Again</button>

        {/* ✅ Toggle Quiz2 */}
        <div className="bonus-toggle">
          <button onClick={() => setShowQuiz2(!showQuiz2)}>
            {showQuiz2 ? "Hide Bonus Quiz" : "Show Bonus Quiz"}
          </button>
        </div>

        {/* ✅ Show Quiz2 if toggled */}
        {showQuiz2 && (
          <div className="bonus-quiz">
            <h3>Bonus Quiz</h3>
            <Quiz2 />
          </div>
        )}
      </div>
    );
  }

  // === Main Quiz Rendering ===
  const currentQues = questions[currentQuestion];
  const answers = [
    ...currentQues.incorrect_answers,
    currentQues.correct_answer,
  ].sort(() => Math.random() - 0.5);

  return (
    <div className="quiz-container">
      <div className="question-section">
        <div className="question-count">
          <span>Question {currentQuestion + 1}</span> / {questions.length}
        </div>
        <div
          className="question-text"
          dangerouslySetInnerHTML={{ __html: currentQues.question }}
        />
      </div>
      <div className="answer-section">
        {answers.map((answer, index) => (
          <button
            key={index}
            onClick={() => handleAnswerClick(answer)}
            dangerouslySetInnerHTML={{ __html: answer }}
          />
        ))}
      </div>
    </div>
  );
};

export default Quiz;
