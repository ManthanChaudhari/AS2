'use client'

import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

// Dummy chart data
const messageVolumeData = [
  { date: '2024-10-07', sent: 45, received: 38 },
  { date: '2024-10-08', sent: 52, received: 41 },
  { date: '2024-10-09', sent: 48, received: 45 },
  { date: '2024-10-10', sent: 61, received: 52 },
  { date: '2024-10-11', sent: 55, received: 48 },
  { date: '2024-10-12', sent: 67, received: 58 },
  { date: '2024-10-13', sent: 73, received: 62 }
]

const successRateData = [
  { name: 'Successful', value: 892, color: '#22c55e' },
  { name: 'Failed', value: 45, color: '#ef4444' },
  { name: 'Pending', value: 23, color: '#f59e0b' }
]

const topPartnersData = [
  { partner: 'FDA FAERS', messages: 156, success: 98.5 },
  { partner: 'EMA EudraVigilance', messages: 134, success: 97.8 },
  { partner: 'Health Canada', messages: 89, success: 96.2 },
  { partner: 'MHRA', messages: 67, success: 99.1 },
  { partner: 'Pfizer Inc.', messages: 45, success: 100 }
]

const transmissionTrendsData = [
  { time: '00:00', volume: 12 },
  { time: '04:00', volume: 8 },
  { time: '08:00', volume: 45 },
  { time: '12:00', volume: 67 },
  { time: '16:00', volume: 52 },
  { time: '20:00', volume: 28 }
]

export function MessageVolumeChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Message Volume (Last 7 Days)
          <Badge variant="secondary">Daily</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={messageVolumeData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="date" 
              className="text-muted-foreground"
              tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            />
            <YAxis className="text-muted-foreground" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
              labelFormatter={(value) => new Date(value).toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'short', 
                day: 'numeric' 
              })}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="sent" 
              stroke="#3b82f6" 
              strokeWidth={2}
              name="Messages Sent"
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="received" 
              stroke="#22c55e" 
              strokeWidth={2}
              name="Messages Received"
              dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export function SuccessRateChart() {
  const total = successRateData.reduce((sum, item) => sum + item.value, 0)
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transmission Success Rate</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={successRateData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {successRateData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
                formatter={(value) => [
                  `${value} (${((value / total) * 100).toFixed(1)}%)`,
                  'Messages'
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center space-x-6 mt-4">
          {successRateData.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-muted-foreground">
                {item.name}: {item.value}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function TopPartnersChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Active Partners</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topPartnersData} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis type="number" className="text-muted-foreground" />
            <YAxis 
              type="category" 
              dataKey="partner" 
              className="text-muted-foreground"
              width={120}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
              formatter={(value, name) => [
                name === 'messages' ? `${value} messages` : `${value}% success rate`,
                name === 'messages' ? 'Total Messages' : 'Success Rate'
              ]}
            />
            <Bar 
              dataKey="messages" 
              fill="#3b82f6"
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export function TransmissionTrendsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Transmission Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={transmissionTrendsData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="time" 
              className="text-muted-foreground"
            />
            <YAxis className="text-muted-foreground" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
              formatter={(value) => [`${value} messages`, 'Volume']}
              labelFormatter={(value) => `Time: ${value}`}
            />
            <Area 
              type="monotone" 
              dataKey="volume" 
              stroke="#8b5cf6" 
              fill="#8b5cf6"
              fillOpacity={0.3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}