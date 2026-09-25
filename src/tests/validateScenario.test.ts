import { describe, expect, it } from 'vitest'
import { validateScenario } from '../engine'
import { brazilPresidency } from '../scenarios/brazilPresidency'

describe('validateScenario', () => {
  it('aceita o mapa inicial com quatro indicadores nacionais', () => {
    expect(validateScenario(brazilPresidency)).toEqual([])
  })

  it('recusa um cenário que não tenha quatro indicadores', () => {
    expect(validateScenario({ ...brazilPresidency, indicators: [] })).not.toEqual([])
  })
})
