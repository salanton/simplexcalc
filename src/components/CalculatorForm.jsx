import { useState } from 'react';

function CalculatorForm({ stages, onCalculate }) {
  const [stage, setStage] = useState(stages[0]);
  const [liters, setLiters] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    onCalculate(stage, liters);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block">
        Этап жизни растения:
        <select className="w-full p-2 border rounded" value={stage} onChange={(e) => setStage(e.target.value)}>
          {stages.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </label>
      <label className="block">
        Объем раствора (л):
        <input
          type="number"
          min={0.1}
          step={0.1}
          value={liters}
          onChange={(e) => setLiters(parseFloat(e.target.value))}
          className="w-full p-2 border rounded"
        />
      </label>
      <button className="bg-black text-white px-4 py-2 rounded" type="submit">Рассчитать</button>
    </form>
  );
}

export default CalculatorForm;