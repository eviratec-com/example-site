import fetchType from './fetchType'
import incrementCounter from './increment'
import decrementCounter from './decrement'

import type { Counter, CounterType } from '@/types/Counter'
import { CounterTopic, CounterCounts } from '@/types/CounterEnum'

export async function increaseCount (
  topic: CounterTopic,
  target: number,
  counts: CounterCounts,
  amt: number
): Promise<Counter> {
  const counterType: CounterType = await fetchType(topic, counts)
  const counter: Counter = await incrementCounter(target, counterType, amt)

  return counter
}

export async function decreaseCount (
  topic: CounterTopic,
  target: number,
  counts: CounterCounts,
  amt: number
): Promise<Counter> {
  const counterType: CounterType = await fetchType(topic, counts)
  const counter: Counter = await decrementCounter(target, counterType, amt)

  return counter
}
