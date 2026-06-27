const STEPS = [
    { id: 1, label: 'Capturar' },
    { id: 2, label: 'Moldura' },
    { id: 3, label: 'Revelar' },
  ]
  
  export default function StepProgress({ step, onBack }) {
    return (
      <div className="wizard-nav">
        <button className="wizard-back" onClick={onBack} disabled={step === 1} aria-label="Voltar para a etapa anterior">
          ‹
        </button>
        <div className="wizard-steps">
          {STEPS.map((s) => (
            <span key={s.id} className={`wizard-step ${s.id === step ? 'active' : s.id < step ? 'done' : ''}`}>
              <span className="wizard-step-dot">{s.id < step ? '✓' : s.id}</span>
              {s.label}
            </span>
          ))}
        </div>
      </div>
    )
  }