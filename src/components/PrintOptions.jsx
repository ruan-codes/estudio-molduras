const OPTIONS = [
    { id: 'single', label: '1 foto' },
    { id: 'strip3', label: 'Tirinha 3x' },
    { id: 'strip4', label: 'Tirinha 4x' },
  ]
  
  export default function PrintOptions({ value, onChange }) {
    return (
      <div className="print-options">
        <span className="print-options-label">Layout de impressão</span>
        <div className="print-options-chips">
          {OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              className={`chip ${value === opt.id ? 'active' : ''}`}
              onClick={() => onChange(opt.id)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    )
  }