function ResultsDisplay({ stage, liters, result }) {
  return (
    <section className="mt-6">
      <h2 className="text-lg font-semibold">Результат для этапа: {stage}</h2>
      <p className="mb-2">Объем раствора: {liters} л</p>
      <ul className="space-y-1">
        {Object.entries(result).map(([name, val]) => (
          <li key={name} className="border-b py-1">
            <strong>{name}:</strong> {val}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default ResultsDisplay;
