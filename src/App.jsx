import axios from "axios";
import { useState, useEffect } from "react";

function App() {
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answerStatus, setAnswerStatus] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Base API URL
  const API_URL = "/proxy";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(API_URL);

        if (response.data && Array.isArray(response.data.questions)) {
          const formattedQuestions = response.data.questions.map((q) => {
            return {
              id: q.id,
              question: q.description || "No question available",

              options: q.options && Array.isArray(q.options) ? q.options : "",
            };
          });
          setQuestions(formattedQuestions);
        } else {
          console.error("api response format:", response.data);
        }
      } catch (error) {
        console.error("error fetching in  quiz data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAnswerClick = (selectedAnswer) => {
    if (!questions.length) return;

    const isCorrect = selectedAnswer.is_correct;
    if (isCorrect) setScore((prev) => prev + 1);

    setAnswerStatus(isCorrect ? "correct" : "wrong");

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
        setAnswerStatus(null);
      } else {
        alert(
          `Quiz finished! Your final score is: ${isCorrect ? score + 1 : score}`
        );
        handleReset();
      }
    }, 1000);
  };

  const handleReset = () => {
    setScore(0);
    setCurrentQuestion(0);
    setAnswerStatus(null);
  };

  if (loading)
    return <div className="text-center mt-20 text-xl">Loading quiz...</div>;
  if (!questions.length)
    return (
      <div className="text-center mt-20 text-xl text-red-500">
        No quiz data available.
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto flex justify-center items-center my-20">
      <div className="w-full md:w-1/2 p-6 rounded-xl border border-gray-300 shadow-lg">
        <h1 className="text-center my-6 font-bold text-2xl">QuizApp</h1>
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold">Your Score: {score}</h3>
        </div>
        {questions.length > 0 && questions[currentQuestion] && (
          <div className="mb-6">
            <h2 className="font-semibold text-lg">
              {questions[currentQuestion].question}
            </h2>
            <div>
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerClick(option)}
                  className={`block w-full my-2 px-4 py-2 rounded-md text-white transition-all duration-200 ${
                    answerStatus && option.is_correct
                      ? "bg-green-500"
                      : answerStatus && "bg-red-500"
                  } ${!answerStatus ? "bg-blue-500 hover:bg-blue-600" : ""}`}
                  disabled={answerStatus !== null}
                >
                  {option.description}
                </button>
              ))}
            </div>
            {answerStatus === "wrong" && (
              <p className="text-red-500 mt-2">Wrong answer, try again!</p>
            )}
          </div>
        )}
        <div className="text-center mt-6">
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Reset Quiz
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
