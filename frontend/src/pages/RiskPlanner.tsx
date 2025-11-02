import { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';

interface RiskQuestion {
  id: string;
  question: string;
  options: { value: number; text: string }[];
}

const riskQuestions: RiskQuestion[] = [
  {
    id: 'age',
    question: 'What is your age group?',
    options: [
      { value: 4, text: 'Under 25' },
      { value: 3, text: '25-35' },
      { value: 2, text: '36-50' },
      { value: 1, text: 'Over 50' }
    ]
  },
  {
    id: 'investment_experience',
    question: 'How would you describe your investment experience?',
    options: [
      { value: 1, text: 'No experience' },
      { value: 2, text: 'Limited experience' },
      { value: 3, text: 'Moderate experience' },
      { value: 4, text: 'Extensive experience' }
    ]
  },
  {
    id: 'loss_tolerance',
    question: 'If your investment lost 20% in a year, what would you do?',
    options: [
      { value: 1, text: 'Sell immediately to prevent further losses' },
      { value: 2, text: 'Sell some to reduce risk' },
      { value: 3, text: 'Hold and wait for recovery' },
      { value: 4, text: 'Buy more at lower prices' }
    ]
  },
  {
    id: 'time_horizon',
    question: 'What is your investment time horizon?',
    options: [
      { value: 1, text: 'Less than 2 years' },
      { value: 2, text: '2-5 years' },
      { value: 3, text: '5-10 years' },
      { value: 4, text: 'More than 10 years' }
    ]
  },
  {
    id: 'income_stability',
    question: 'How stable is your income?',
    options: [
      { value: 1, text: 'Very unstable' },
      { value: 2, text: 'Somewhat unstable' },
      { value: 3, text: 'Stable' },
      { value: 4, text: 'Very stable' }
    ]
  }
];

export function RiskPlanner() {
  const { user } = useAuth();
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [riskProfile, setRiskProfile] = useState<string>('');

  const handleAnswer = (questionId: string, value: number) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);

    if (currentQuestion < riskQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateRiskProfile(newAnswers);
    }
  };

  const calculateRiskProfile = (allAnswers: Record<string, number>) => {
    const totalScore = Object.values(allAnswers).reduce((sum, score) => sum + score, 0);
    const avgScore = totalScore / riskQuestions.length;

    let profile = '';

    if (avgScore <= 1.5) {
      profile = 'Conservative';
    } else if (avgScore <= 2.5) {
      profile = 'Moderate';
    } else if (avgScore <= 3.5) {
      profile = 'Aggressive';
    } else {
      profile = 'Very Aggressive';
    }

    setRiskProfile(profile);
    setIsComplete(true);
  };

  const resetAssessment = () => {
    setAnswers({});
    setCurrentQuestion(0);
    setIsComplete(false);
    setRiskProfile('');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="text-center p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Login Required</h2>
          <p className="text-slate-600 mb-6">Please log in to access the Risk Planner.</p>
          <Button onClick={() => window.location.href = '/login'}>
            Go to Login
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">
            Personal Risk Assessment
          </h1>
          <p className="text-lg text-slate-600">
            Discover your investment risk profile and get personalized allocation recommendations
          </p>
        </div>

        {!isComplete ? (
          <Card className="max-w-2xl mx-auto">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium text-slate-600">
                  Question {currentQuestion + 1} of {riskQuestions.length}
                </span>
                <div className="w-32 bg-slate-200 rounded-full h-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestion + 1) / riskQuestions.length) * 100}%` }}
                  />
                </div>
              </div>
              <h2 className="text-xl font-semibold text-slate-900 mb-6">
                {riskQuestions[currentQuestion].question}
              </h2>
            </div>

            <div className="space-y-3">
              {riskQuestions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(riskQuestions[currentQuestion].id, option.value)}
                  className="w-full text-left p-4 rounded-lg border border-slate-200 hover:border-primary-300 hover:bg-primary-50 transition-colors"
                >
                  <span className="font-medium text-slate-900">{option.text}</span>
                </button>
              ))}
            </div>

            {currentQuestion > 0 && (
              <div className="mt-6 flex justify-between">
                <Button 
                  variant="ghost" 
                  onClick={() => setCurrentQuestion(currentQuestion - 1)}
                >
                  Previous
                </Button>
              </div>
            )}
          </Card>
        ) : (
          <div className="max-w-2xl mx-auto space-y-6">
            <Card className="text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  Your Risk Profile: {riskProfile}
                </h2>
                <p className="text-slate-600">
                  Based on your responses, here's your recommended asset allocation
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">
                    {riskProfile === 'Conservative' ? '20%' : 
                     riskProfile === 'Moderate' ? '50%' : 
                     riskProfile === 'Aggressive' ? '70%' : '80%'}
                  </div>
                  <div className="text-sm text-slate-600">Equity</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary-600">
                    {riskProfile === 'Conservative' ? '70%' : 
                     riskProfile === 'Moderate' ? '40%' : 
                     riskProfile === 'Aggressive' ? '20%' : '10%'}
                  </div>
                  <div className="text-sm text-slate-600">Debt</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-warning-600">5%</div>
                  <div className="text-sm text-slate-600">Gold</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent-600">5%</div>
                  <div className="text-sm text-slate-600">REITs</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={() => window.location.href = '/dashboard'}>
                  Apply to Dashboard
                </Button>
                <Button variant="ghost" onClick={resetAssessment}>
                  Retake Assessment
                </Button>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                What does "{riskProfile}" mean?
              </h3>
              <div className="text-slate-600">
                {riskProfile === 'Conservative' && (
                  <p>You prefer stability and are willing to accept lower returns to minimize risk. Your portfolio focuses on debt instruments with minimal equity exposure.</p>
                )}
                {riskProfile === 'Moderate' && (
                  <p>You seek a balance between growth and stability. Your portfolio has a balanced mix of equity and debt to provide steady returns with moderate risk.</p>
                )}
                {riskProfile === 'Aggressive' && (
                  <p>You're comfortable with higher risk for potentially higher returns. Your portfolio has a higher equity allocation for long-term wealth creation.</p>
                )}
                {riskProfile === 'Very Aggressive' && (
                  <p>You have a high risk tolerance and long investment horizon. Your portfolio maximizes equity exposure for maximum growth potential.</p>
                )}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}