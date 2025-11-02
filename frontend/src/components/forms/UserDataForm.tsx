import { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
// Using fetch API directly for backend communication

interface UserDataFormProps {
  onComplete?: () => void;
  initialData?: Partial<FinancialProfileData>;
}

export interface FinancialProfileData {
  // Basic Demographics & Income (Q1-Q2)
  age: number;
  income: number;
  
  // Expenses & Obligations (Q3-Q4)
  essentials: number;
  emi: number;
  
  // Financial Stability & Emergency Fund (Q5-Q6)
  incomeStability: 'Very Stable' | 'Stable' | 'Variable' | 'Highly Variable';
  emergencyMonths: '0' | '1-2' | '3-5' | '6-9' | '10+';
  
  // Investment Horizon & Risk Tolerance (Q7-Q8)
  primaryHorizon: '<1y' | '1-3y' | '3-5y' | '5-10y' | '>10y';
  selfTolerance: 'Very Low' | 'Low' | 'Moderate' | 'High' | 'Very High';
  
  // Drawdown Comfort & Experience (Q9-Q10)
  maxDrawdown: '0-5%' | '5-10%' | '10-20%' | '20-35%' | '35%+';
  experience: 'None' | 'Beginner' | 'Intermediate' | 'Advanced';
  
  // Optional fields (computed or derived)
  dependents?: number;
  liquidityNeed?: 'Within 3 months' | '3-12 months' | '1-3 years' | '>3 years (unlikely)';
  taxBracket?: '10%' | '20%' | '30%';
  goals?: Array<{
    title: string;
    targetAmount: number;
    targetDate: string;
    priority?: 'High' | 'Medium' | 'Low';
  }>;
}

export function UserDataForm({ onComplete, initialData }: UserDataFormProps) {
  const [formData, setFormData] = useState<FinancialProfileData>({
    age: initialData?.age || 30,
    income: initialData?.income || 0,
    essentials: initialData?.essentials || 0,
    emi: initialData?.emi || 0,
    incomeStability: initialData?.incomeStability || 'Stable',
    emergencyMonths: initialData?.emergencyMonths || '3-5',
    primaryHorizon: initialData?.primaryHorizon || '5-10y',
    selfTolerance: initialData?.selfTolerance || 'Moderate',
    maxDrawdown: initialData?.maxDrawdown || '10-20%',
    experience: initialData?.experience || 'Beginner',
    dependents: initialData?.dependents || 0,
    liquidityNeed: initialData?.liquidityNeed || '>3 years (unlikely)',
    taxBracket: initialData?.taxBracket || '20%',
    goals: initialData?.goals || []
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const totalSteps = 5;

  const handleInputChange = (field: keyof FinancialProfileData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const validateStep = (step: number): string | null => {
    switch (step) {
      case 1:
        if (!formData.age || formData.age < 18 || formData.age > 100) {
          return 'Please enter a valid age between 18 and 100';
        }
        if (!formData.income || formData.income <= 0) {
          return 'Please enter a valid monthly income';
        }
        break;
      case 2:
        if (formData.essentials < 0) {
          return 'Essential expenses cannot be negative';
        }
        if (formData.emi < 0) {
          return 'EMI cannot be negative';
        }
        if (formData.essentials + formData.emi > formData.income) {
          return 'Essential expenses plus EMI cannot exceed income';
        }
        break;
      case 3:
        if (!formData.incomeStability) {
          return 'Please select your income stability';
        }
        if (!formData.emergencyMonths) {
          return 'Please select your emergency fund status';
        }
        break;
      case 4:
        if (!formData.primaryHorizon) {
          return 'Please select your investment horizon';
        }
        if (!formData.selfTolerance) {
          return 'Please select your risk tolerance';
        }
        break;
      case 5:
        if (!formData.maxDrawdown) {
          return 'Please select maximum acceptable loss';
        }
        if (!formData.experience) {
          return 'Please select your investment experience';
        }
        break;
    }
    return null;
  };

  const handleNext = async () => {
    const validationError = validateStep(currentStep);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      await handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5001/api/profile/intake', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        onComplete?.();
      } else {
        setError(result.error || 'Failed to save profile');
      }
    } catch (err: any) {
      console.error('Profile submission error:', err);
      setError(err.message || 'Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError(null);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-slate-900 mb-2">Let's start with the basics</h3>
        <p className="text-slate-600">We need to understand your current demographics and income</p>
      </div>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">
            Q1: What is your current age?
          </label>
          <div className="max-w-xs">
            <Input
              type="number"
              value={formData.age}
              onChange={(e) => handleInputChange('age', Number(e.target.value))}
              placeholder="Enter your age"
              min="18"
              max="100"
              className="text-center text-lg"
            />
          </div>
          <p className="text-sm text-slate-500 mt-1">This helps us assess your investment capacity over time</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">
            Q2: What is your monthly gross income?
          </label>
          <div className="max-w-md">
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">₹</span>
              <Input
                type="number"
                value={formData.income}
                onChange={(e) => handleInputChange('income', Number(e.target.value))}
                placeholder="Enter monthly income"
                className="pl-8 text-lg"
              />
            </div>
          </div>
          <p className="text-sm text-slate-500 mt-1">Include salary, business income, rental income, etc.</p>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-slate-900 mb-2">Your Monthly Expenses</h3>
        <p className="text-slate-600">Help us understand your financial obligations and available surplus</p>
      </div>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">
            Q3: What are your essential monthly expenses?
          </label>
          <div className="max-w-md">
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">₹</span>
              <Input
                type="number"
                value={formData.essentials}
                onChange={(e) => handleInputChange('essentials', Number(e.target.value))}
                placeholder="Enter essential expenses"
                className="pl-8 text-lg"
              />
            </div>
          </div>
          <p className="text-sm text-slate-500 mt-1">Food, housing, utilities, transport, insurance, etc.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">
            Q4: What are your monthly EMI/loan payments?
          </label>
          <div className="max-w-md">
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">₹</span>
              <Input
                type="number"
                value={formData.emi}
                onChange={(e) => handleInputChange('emi', Number(e.target.value))}
                placeholder="Enter EMI amount"
                className="pl-8 text-lg"
              />
            </div>
          </div>
          <p className="text-sm text-slate-500 mt-1">Home loan, car loan, personal loan, credit card EMIs</p>
        </div>

        {/* Financial Summary */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
          <h4 className="font-medium text-slate-900 mb-2">Your Monthly Surplus</h4>
          <div className="text-lg">
            <span className="text-slate-600">Available for investments: </span>
            <span className="font-bold text-green-600">
              ₹{Math.max(0, formData.income - formData.essentials - formData.emi).toLocaleString()}
            </span>
          </div>
          {formData.income - formData.essentials - formData.emi < 0 && (
            <p className="text-sm text-red-600 mt-1">⚠️ Your expenses exceed income. Consider reviewing your budget.</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-slate-900 mb-2">Financial Stability</h3>
        <p className="text-slate-600">Understanding your income stability and emergency preparedness</p>
      </div>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">
            Q5: How stable is your income source?
          </label>
          <div className="space-y-2">
            {[
              { value: 'Very Stable', desc: 'Government job, tenured position', icon: '🛡️' },
              { value: 'Stable', desc: 'Corporate job with stable company', icon: '🏢' },
              { value: 'Variable', desc: 'Sales-based, consulting, contract work', icon: '📊' },
              { value: 'Highly Variable', desc: 'Freelancing, business with irregular income', icon: '💼' }
            ].map((option) => (
              <label key={option.value} className="flex items-start gap-3 p-4 border rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="incomeStability"
                  value={option.value}
                  checked={formData.incomeStability === option.value}
                  onChange={(e) => handleInputChange('incomeStability', e.target.value as FinancialProfileData['incomeStability'])}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{option.icon}</span>
                    <span className="font-medium text-slate-900">{option.value}</span>
                  </div>
                  <div className="text-sm text-slate-600 mt-1">{option.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">
            Q6: How many months of expenses do you have saved as emergency fund?
          </label>
          <div className="space-y-2">
            {[
              { value: '0', desc: 'No emergency fund', color: 'text-red-600', icon: '🚨' },
              { value: '1-2', desc: '1-2 months', color: 'text-orange-600', icon: '⚠️' },
              { value: '3-5', desc: '3-5 months (recommended minimum)', color: 'text-yellow-600', icon: '👍' },
              { value: '6-9', desc: '6-9 months (well prepared)', color: 'text-green-600', icon: '✅' },
              { value: '10+', desc: '10+ months (very conservative)', color: 'text-blue-600', icon: '💪' }
            ].map((option) => (
              <label key={option.value} className="flex items-start gap-3 p-4 border rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="emergencyMonths"
                  value={option.value}
                  checked={formData.emergencyMonths === option.value}
                  onChange={(e) => handleInputChange('emergencyMonths', e.target.value as FinancialProfileData['emergencyMonths'])}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{option.icon}</span>
                    <span className={`font-medium ${option.color}`}>{option.desc}</span>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-slate-900 mb-2">Investment Timeline & Risk Appetite</h3>
        <p className="text-slate-600">Understanding your investment goals and risk comfort level</p>
      </div>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">
            Q7: What is your primary investment time horizon?
          </label>
          <div className="space-y-2">
            {[
              { value: '<1y', desc: 'Less than 1 year', icon: '⚡', color: 'border-red-200 hover:bg-red-50' },
              { value: '1-3y', desc: '1-3 years', icon: '🎯', color: 'border-orange-200 hover:bg-orange-50' },
              { value: '3-5y', desc: '3-5 years', icon: '📈', color: 'border-yellow-200 hover:bg-yellow-50' },
              { value: '5-10y', desc: '5-10 years', icon: '🚀', color: 'border-green-200 hover:bg-green-50' },
              { value: '>10y', desc: 'More than 10 years', icon: '🌱', color: 'border-blue-200 hover:bg-blue-50' }
            ].map((option) => (
              <label key={option.value} className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${option.color}`}>
                <input
                  type="radio"
                  name="primaryHorizon"
                  value={option.value}
                  checked={formData.primaryHorizon === option.value}
                  onChange={(e) => handleInputChange('primaryHorizon', e.target.value as FinancialProfileData['primaryHorizon'])}
                  className="mt-1"
                />
                <span className="text-xl">{option.icon}</span>
                <div className="font-medium text-slate-900">{option.desc}</div>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">
            Q8: How would you describe your risk tolerance?
          </label>
          <div className="space-y-2">
            {[
              { value: 'Very Low', desc: 'I prefer guaranteed returns, even if lower', icon: '🛡️', color: 'border-blue-200 hover:bg-blue-50' },
              { value: 'Low', desc: 'I can accept small fluctuations for slightly better returns', icon: '🏦', color: 'border-green-200 hover:bg-green-50' },
              { value: 'Moderate', desc: 'I can handle moderate ups and downs for good long-term growth', icon: '⚖️', color: 'border-yellow-200 hover:bg-yellow-50' },
              { value: 'High', desc: 'I can accept significant volatility for high growth potential', icon: '🎢', color: 'border-orange-200 hover:bg-orange-50' },
              { value: 'Very High', desc: 'I thrive on high-risk, high-reward investments', icon: '🔥', color: 'border-red-200 hover:bg-red-50' }
            ].map((option) => (
              <label key={option.value} className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${option.color}`}>
                <input
                  type="radio"
                  name="selfTolerance"
                  value={option.value}
                  checked={formData.selfTolerance === option.value}
                  onChange={(e) => handleInputChange('selfTolerance', e.target.value as FinancialProfileData['selfTolerance'])}
                  className="mt-1"
                />
                <span className="text-xl">{option.icon}</span>
                <div className="flex-1">
                  <div className="font-medium text-slate-900">{option.value}</div>
                  <div className="text-sm text-slate-600 mt-1">{option.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-slate-900 mb-2">Loss Tolerance & Experience</h3>
        <p className="text-slate-600">Final questions to complete your risk profile</p>
      </div>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">
            Q9: What is the maximum loss you can tolerate in your portfolio in a year?
          </label>
          <div className="space-y-2">
            {[
              { value: '0-5%', desc: 'Very conservative - minimal losses acceptable', icon: '🛡️', color: 'border-blue-200 hover:bg-blue-50' },
              { value: '5-10%', desc: 'Conservative - small losses acceptable', icon: '🏛️', color: 'border-green-200 hover:bg-green-50' },
              { value: '10-20%', desc: 'Moderate - can handle typical market corrections', icon: '📊', color: 'border-yellow-200 hover:bg-yellow-50' },
              { value: '20-35%', desc: 'Aggressive - can handle major market downturns', icon: '🎢', color: 'border-orange-200 hover:bg-orange-50' },
              { value: '35%+', desc: 'Very Aggressive - can handle severe market crashes', icon: '🔥', color: 'border-red-200 hover:bg-red-50' }
            ].map((option) => (
              <label key={option.value} className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${option.color}`}>
                <input
                  type="radio"
                  name="maxDrawdown"
                  value={option.value}
                  checked={formData.maxDrawdown === option.value}
                  onChange={(e) => handleInputChange('maxDrawdown', e.target.value as FinancialProfileData['maxDrawdown'])}
                  className="mt-1"
                />
                <span className="text-xl">{option.icon}</span>
                <div className="flex-1">
                  <div className="font-medium text-slate-900">{option.value}</div>
                  <div className="text-sm text-slate-600 mt-1">{option.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">
            Q10: What is your investment experience level?
          </label>
          <div className="space-y-2">
            {[
              { value: 'None', desc: 'No previous investment experience', icon: '🌱', color: 'border-gray-200 hover:bg-gray-50' },
              { value: 'Beginner', desc: 'Basic knowledge, invested in FDs/RDs', icon: '📚', color: 'border-blue-200 hover:bg-blue-50' },
              { value: 'Intermediate', desc: 'Some experience with mutual funds/stocks', icon: '📈', color: 'border-green-200 hover:bg-green-50' },
              { value: 'Advanced', desc: 'Experienced with diverse investment options', icon: '🎯', color: 'border-purple-200 hover:bg-purple-50' }
            ].map((option) => (
              <label key={option.value} className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${option.color}`}>
                <input
                  type="radio"
                  name="experience"
                  value={option.value}
                  checked={formData.experience === option.value}
                  onChange={(e) => handleInputChange('experience', e.target.value as FinancialProfileData['experience'])}
                  className="mt-1"
                />
                <span className="text-xl">{option.icon}</span>
                <div className="flex-1">
                  <div className="font-medium text-slate-900">{option.value}</div>
                  <div className="text-sm text-slate-600 mt-1">{option.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Final Summary before submission */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-slate-900 mb-4 text-center">🎯 Your Financial Profile Summary</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-600">Age:</span>
            <span className="font-medium text-slate-900">{formData.age} years</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Monthly Surplus:</span>
            <span className="font-medium text-green-600">
              ₹{Math.max(0, formData.income - formData.essentials - formData.emi).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Income Stability:</span>
            <span className="font-medium text-slate-900">{formData.incomeStability}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Emergency Fund:</span>
            <span className="font-medium text-slate-900">{formData.emergencyMonths} months</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Investment Horizon:</span>
            <span className="font-medium text-slate-900">{formData.primaryHorizon}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Risk Tolerance:</span>
            <span className="font-medium text-slate-900">{formData.selfTolerance}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Max Loss Comfort:</span>
            <span className="font-medium text-slate-900">{formData.maxDrawdown}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Experience:</span>
            <span className="font-medium text-slate-900">{formData.experience}</span>
          </div>
        </div>
        <div className="mt-4 p-3 bg-white rounded border text-center">
          <p className="text-sm text-slate-600">Ready to create your personalized investment strategy!</p>
        </div>
      </div>
    </div>
  );

  return (
    <Card className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-slate-900">Setup Your Financial Profile</h2>
          <span className="text-sm text-slate-600">Step {currentStep} of {totalSteps}</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div 
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {currentStep === 1 && renderStep1()}
      {currentStep === 2 && renderStep2()}
      {currentStep === 3 && renderStep3()}
      {currentStep === 4 && renderStep4()}
      {currentStep === 5 && renderStep5()}

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="flex justify-between mt-8">
        <Button 
          variant="ghost" 
          onClick={handlePrevious}
          disabled={currentStep === 1}
        >
          Previous
        </Button>
        <Button 
          onClick={handleNext}
          disabled={loading}
        >
          {loading ? 'Processing...' : (currentStep === totalSteps ? 'Create Profile' : 'Next')}
        </Button>
      </div>
    </Card>
  );
}