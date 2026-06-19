import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

/**
 * Componente per visualizzare un grafico comparativo delle complessità temporali
 * Mostra O(1), O(log n), O(n) e O(n²) insieme per confrontare la crescita
 */
export function BigOComparisonChart() {
  // Genera dati per confrontare tutte le complessità
  // n va da 1 a 12 per mostrare chiaramente le differenze senza che O(n²) domini troppo
  const data = Array.from({ length: 12 }, (_, i) => {
    const n = i + 1
    return {
      n: n,
      'O(1)': 1, // Costante: sempre 1
      'O(log n)': Math.log2(n), // Logaritmica
      'O(n)': n, // Lineare
      'O(n²)': n * n, // Quadratica
    }
  })

  return (
    <div className="my-8 w-full">
      <ResponsiveContainer width="100%" height={500}>
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="n"
            label={{ value: 'n (input size)', position: 'insideBottom', offset: -5 }}
            className="text-muted-foreground"
          />
          <YAxis
            label={{ value: 'Operazioni', angle: -90, position: 'insideLeft' }}
            className="text-muted-foreground"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--background)',
              border: '1px solid var(--border)',
              borderRadius: '0.5rem',
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="O(1)"
            stroke="hsl(142, 71%, 45%)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6 }}
            name="O(1) - Costante"
          />
          <Line
            type="monotone"
            dataKey="O(log n)"
            stroke="hsl(217, 91%, 60%)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6 }}
            name="O(log n) - Logaritmica"
          />
          <Line
            type="monotone"
            dataKey="O(n)"
            stroke="hsl(38, 92%, 50%)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6 }}
            name="O(n) - Lineare"
          />
          <Line
            type="monotone"
            dataKey="O(n²)"
            stroke="hsl(0, 84%, 60%)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6 }}
            name="O(n²) - Quadratica"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

