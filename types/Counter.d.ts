import { CounterTopic, CounterType } from './CounterEnum'

export type CounterType = {
  id: number
  topic: CounterTopic
  counts: CounterCounts
}

export type Counter = {
  target: number
  type: number|CounterType
  count: number
}
