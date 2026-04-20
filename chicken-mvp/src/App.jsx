import { useState } from 'react'
import Step1_BrandSelect from './components/Step1_BrandSelect'
import Step2_QuestionSelect from './components/Step2_QuestionSelect'
import Step3_DetailExplore from './components/Step3_DetailExplore'

export default function App() {
  const [step, setStep] = useState(1)
  const [selectedBrand, setSelectedBrand] = useState(null)
  const [selectedQuestion, setSelectedQuestion] = useState(null)

  const handleBrandSelect = (brandId) => {
    setSelectedBrand(brandId)
    setStep(2)
  }

  const handleQuestionSelect = (questionId) => {
    setSelectedQuestion(questionId)
    setStep(3)
  }

  const handleReset = () => {
    setStep(1)
    setSelectedBrand(null)
    setSelectedQuestion(null)
  }

  return (
    <div className="max-w-md mx-auto">
      {step === 1 && (
        <Step1_BrandSelect onSelect={handleBrandSelect} />
      )}
      {step === 2 && (
        <Step2_QuestionSelect
          brandId={selectedBrand}
          onSelect={handleQuestionSelect}
          onBack={() => setStep(1)}
        />
      )}
      {step === 3 && (
        <Step3_DetailExplore
          brandId={selectedBrand}
          questionId={selectedQuestion}
          onBack={() => setStep(2)}
          onReset={handleReset}
        />
      )}
    </div>
  )
}
