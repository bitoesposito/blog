import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

/**
 * Componente per visualizzare un grafico lineare che rappresenta la complessità O(n²)
 * Mostra come il tempo di esecuzione cresce quadraticamente con l'aumentare di n
 */
export function BigOQuadraticChart() {
  // Genera dati per rappresentare O(n²) - crescita quadratica
  // n va da 0 a 12, e le operazioni corrispondono a n²
  const data = Array.from({ length: 13 }, (_, i) => ({
    n: i,
    operazioni: i * i, // O(n²) significa che le operazioni sono uguali a n²
  }))

  return (
    <div className="my-8 w-full">
      <ResponsiveContainer width="100%" height={300}>
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
          <Line
            type="monotone"
            dataKey="operazioni"
            stroke="var(--primary)"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

