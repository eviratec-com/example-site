import React, { useCallback, useState } from 'react'

import type { Plan } from '@/types/Plan'

import * as PLAN from '@/inc/plans'

import styles from './PlanSelection.module.css'

interface Props {
  currentPlan?: Plan
  onSelect?: (plan: Plan) => void
}

export default function PlanSelection({ currentPlan, onSelect }: Props) {
  const [plans, setPlans] = useState<Plan[]>([
    PLAN.LITE_PLAN,
    PLAN.STANDARD_PLAN,
    PLAN.PREMIUM_PLAN,
  ])

  const handleClick = useCallback((event, plan) => {
    onSelect && onSelect(plan)
  }, [onSelect])

  return (
    <div className={styles._}>
      {plans.length > 0 &&
        <div>
          {plans.map((plan) => {
            return (
              <div
                key={plan.externalId.stripe}
                onClick={e => handleClick(e, plan)}
                className={`${styles.plan} ${currentPlan === plan ? styles.selected : ''}`}
              >
                {plan.title}
              </div>
            )
          })}
        </div>
      }
    </div>
  )
}
