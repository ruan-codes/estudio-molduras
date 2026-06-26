export default function CaptionInput({ value, onChange }) {
  return (
    <div className="caption-row">
      <label htmlFor="captionInput">Legenda na moldura (opcional)</label>
      <input
        id="captionInput"
        type="text"
        maxLength={40}
        placeholder="ex: Verão 2026 ✦"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}
