import { Canvas } from "@react-three/fiber";
import { OrbitControls, Box } from "@react-three/drei";
import { useState, useEffect } from "react";
import { useEnergyQuest, GameState } from "@/lib/stores/useEnergyQuest";
import { useAudio } from "@/lib/stores/useAudio";
import { shuffle } from "@/lib/utils/fisherYates";
import { quizQuestions, QuizQuestion } from "@/data/quizQuestions";
import { Button } from "@/components/ui/button";

function Level4Scene() {
  const [quizList, setQuizList] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [doorUnlocked, setDoorUnlocked] = useState(false);
  
  const { keysCollected, changeState } = useEnergyQuest();
  const { playSuccess, playHit } = useAudio();

  useEffect(() => {
    if (keysCollected < 3) {
      console.log("[Level 4] Need 3 keys! Current:", keysCollected);
      setTimeout(() => {
        alert("Kamu memerlukan 3 Kunci Energi untuk membuka level ini!");
        changeState(GameState.MainMenu);
      }, 500);
      return;
    }

    const shuffledQuestions = shuffle(quizQuestions).slice(0, 10);
    setQuizList(shuffledQuestions);
    console.log("[Level 4] Quiz initialized with 10 random questions");
  }, [keysCollected, changeState]);

  const handleAnswer = (answerIndex: number) => {
    if (showFeedback) return;

    setSelectedAnswer(answerIndex);
    const correct = answerIndex === quizList[currentQuestion].correctIndex;
    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      playSuccess();
      setTimeout(() => {
        if (currentQuestion + 1 >= quizList.length) {
          setDoorUnlocked(true);
          setTimeout(() => changeState(GameState.EndingScene), 2000);
        } else {
          setCurrentQuestion(prev => prev + 1);
          setShowFeedback(false);
          setSelectedAnswer(null);
        }
      }, 2000);
    } else {
      playHit();
      setTimeout(() => {
        setShowFeedback(false);
        setSelectedAnswer(null);
      }, 2000);
    }
  };

  if (quizList.length === 0 || keysCollected < 3) {
    return (
      <>
        <ambientLight intensity={0.3} />
        <Box position={[0, 0, 0]} args={[2, 3, 0.5]}>
          <meshStandardMaterial color="#1a1a1a" />
        </Box>
        <OrbitControls enablePan={false} />
      </>
    );
  }

  const question = quizList[currentQuestion];

  return (
    <>
      <ambientLight intensity={doorUnlocked ? 1 : 0.3} />
      <directionalLight position={[0, 5, 5]} intensity={doorUnlocked ? 2 : 0.5} />

      <Box position={[0, -1, 0]} args={[20, 0.2, 20]}>
        <meshStandardMaterial color="#1a1a1a" />
      </Box>

      <Box position={[0, 1.5, -5]} args={[4, 3, 0.5]}>
        <meshStandardMaterial 
          color={doorUnlocked ? "#4ade80" : "#3a3a3a"}
          emissive={doorUnlocked ? "#22c55e" : "black"}
          emissiveIntensity={doorUnlocked ? 1 : 0}
        />
      </Box>

      {[0, 1, 2].map((i) => (
        <Box 
          key={i}
          position={[-2 + i * 2, 0, 0]} 
          args={[0.3, 0.8, 0.3]}
        >
          <meshStandardMaterial color="yellow" />
        </Box>
      ))}

      <OrbitControls 
        enablePan={false} 
        minDistance={5} 
        maxDistance={15}
        maxPolarAngle={Math.PI / 2}
      />

      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl px-4 pointer-events-auto">
          <div className="bg-gray-900/95 backdrop-blur-sm p-6 rounded-lg border-2 border-yellow-500 shadow-2xl">
            <div className="text-yellow-400 text-sm mb-2">
              Soal {currentQuestion + 1}/{quizList.length}
            </div>
            
            <h2 className="text-white text-xl font-bold mb-6">
              {question.question}
            </h2>
            
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <Button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={showFeedback}
                  className={`w-full text-left py-4 px-4 text-base ${
                    showFeedback && selectedAnswer === index
                      ? isCorrect
                        ? "bg-green-600 hover:bg-green-600"
                        : "bg-red-600 hover:bg-red-600"
                      : showFeedback
                        ? "bg-gray-700"
                        : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {option}
                </Button>
              ))}
            </div>

            {showFeedback && (
              <div className={`mt-4 p-4 rounded ${isCorrect ? "bg-green-800/50" : "bg-red-800/50"}`}>
                <p className={`font-bold ${isCorrect ? "text-green-300" : "text-red-300"}`}>
                  {isCorrect ? "✓ Benar!" : "✗ Salah! Coba lagi!"}
                </p>
                {isCorrect && (
                  <p className="text-gray-300 text-sm mt-2">{question.explanation}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export function Level4() {
  return (
    <div className="fixed inset-0 bg-black">
      <Canvas camera={{ position: [0, 3, 8], fov: 60 }}>
        <Level4Scene />
      </Canvas>
      
      <div className="fixed top-4 right-4 bg-gray-800/90 p-4 rounded-lg text-white text-sm max-w-xs">
        <h3 className="font-bold mb-2">Level 4: Ruang Bawah Tanah</h3>
        <p className="text-xs text-gray-300">
          Jawab semua soal quiz untuk membuka pintu dan menemukan Profesor Teguh!
        </p>
      </div>
    </div>
  );
}
