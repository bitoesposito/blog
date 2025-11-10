import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

/**
 * Componente per visualizzare un grafico lineare che rappresenta la complessità O(log n)
 * Mostra come il tempo di esecuzione cresce logaritmicamente con l'aumentare di n
 */
export function BigOLogChart() {
  // Genera dati per rappresentare O(log n) - crescita logaritmica
  // n va da 1 a 100, e le operazioni corrispondono a log₂(n)
  // Usiamo log₂ perché è il più comune in informatica (binary search, binary trees)
  // n parte da 1 perché log(0) non è definito
  const data = Array.from({ length: 20 }, (_, i) => {
    const n = i + 1
    return {
      n: n,
      operazioni: Math.log2(n), // O(log n) significa che le operazioni sono logaritmiche rispetto a n
    }
  })

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
            dot={{r: 4}}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

