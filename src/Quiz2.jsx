import React, { useState, useEffect } from "react";

function Quiz2() {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);

  useEffect(() => {
  fetch("/environment_mcqs.json")
    .then((res) => res.json())
    .then((data) => {
      // Shuffle and pick 10 random questions
      const shuffled = data.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 10);
      setQuestions(selected);
    })
    .catch((err) => {
      console.error("Failed to load JSON:", err);
      alert("Error loading quiz questions.");
    });
}, []);


  const handleAnswer = (option) => {
    setSelected(option);
    if (option === questions[current].answer) {
      setScore(score + 1);
    }

    setTimeout(() => {
      setSelected(null);
      if (current + 1 < questions.length) {
        setCurrent(current + 1);
      } else {
        setShowScore(true);
      }
    }, 1000);
  };

  if (!questions.length) {
    return <p className="text-center mt-10">Loading quiz questions...</p>;
  }

  if (showScore) {
    return (
      <div className="text-center mt-10 p-4 border rounded shadow max-w-lg mx-auto">
        <h2 className="text-2xl font-bold mb-4">Quiz Completed!</h2>
        <p className="text-lg">You scored {score} out of {questions.length}.</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 border rounded shadow bg-white">
      <h3 className="text-lg font-semibold mb-4">
        Question {current + 1} of {questions.length}
      </h3>
      <p className="mb-4 font-medium">{questions[current].question}</p>
      <ul>
        {questions[current].options.map((option, index) => (
          <li key={index} className="mb-2">
            <button
              onClick={() => handleAnswer(option)}
              className={`w-full text-left p-2 border rounded transition-colors duration-200 ${
                selected === option
                  ? option === questions[current].answer
                    ? "bg-green-300"
                    : "bg-red-300"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
              disabled={selected !== null}
            >
              {option}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Quiz2;
