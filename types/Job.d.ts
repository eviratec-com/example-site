import type Employer from './Employer'
import type TimePeriod from './TimePeriod'

export type Job = {
  title: string
  tech: string[]
  employer: Employer
  period: TimePeriod
}
