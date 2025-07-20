import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Quiz.css';

const categories = [
  { id: 9, name: "General Knowledge" },
  { id: 23, name: "History" },
  { id: 18, name: "Science: Computers" },
  { id: 30, name: "Science: Gadgets" },
  { id: 17, name: "Science & Nature" },
  {id:10,name:"Science:Mathematic"},
  {id:31,name:"Japanese Anime & Manga"},
  { id: 12, name: "Animals" },
  { id: 22, name: "Geography" },
  { id: 21, name: "Sports" },
  { id: 20, name: "Mythology" },
  { id: 11, name: "Entertainment: Books" },
  { id: 14, name: "Entertainment: Video Games" },
  { id: 15, name: "Entertainment: Board Games" },
  { id: 16, name: "Entertainment: Comics" },
  { id: 19, name: "Entertainment: Film" },
  { id: 24, name: "Entertainment: Japanese TV Shows" },
  { id: 25, name: "Entertainment: Cartoon & Animations" },
  { id: 26, name: "Entertainment: Music" },
  { id: 27, name: "Entertainment: Musicals & Theatres" },
];

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [error, setError] = useState(null);
  const [showQuiz2, setShowQuiz2] = useState(false);

  // New state for tracking answer selection and result
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

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

  const handleAnswerClick = (answer) => {
    if (isAnswered) return;

    setSelectedAnswer(answer);
    setIsAnswered(true);

    const correctAnswer = questions[currentQuestion].correct_answer;
    if (answer === correctAnswer) {
      setScore((prevScore) => prevScore + 1);
    }

    setTimeout(() => {
      const nextQuestion = currentQuestion + 1;
      if (nextQuestion < questions.length) {
        setCurrentQuestion(nextQuestion);
        setSelectedAnswer(null);
        setIsAnswered(false);
      } else {
        setShowScore(true);
      }
    }, 2000);
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  if (selectedCategory === null) 
   {
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

  if (loading || questions.length === 0) {
    return (
      <div className="loading-section">
        {error ? <p>{error}</p> : <p>Loading questions...</p>}
      </div>
    );
  }

  if (showScore) {
    return (
      <div className="score-section">
        <h2>You scored {score} out of {questions.length}!</h2>
        <button onClick={() => setSelectedCategory(null)}>Play Again</button>
      </div>
    );
  }

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
        {answers.map((answer, index) => {
          let className = "answer-button";

          if (isAnswered) {
            const correctAnswer = currentQues.correct_answer;

            if (answer === correctAnswer) {
              className += " correct";
            } else if (answer === selectedAnswer) {
              className += " incorrect";
            }
          }

          return (
            
            <button
              key={index}
              className={className}
              onClick={() => handleAnswerClick(answer)}
              dangerouslySetInnerHTML={{ __html: answer }}
              disabled={isAnswered}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Quiz;
