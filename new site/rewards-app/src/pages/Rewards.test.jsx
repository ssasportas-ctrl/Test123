import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useApp } from '../context/AppContext'
import Rewards from './Rewards'

vi.mock('../context/AppContext', () => ({ useApp: vi.fn() }))

function mockApp(overrides = {}) {
  useApp.mockReturnValue({
    rewards: [
      { id: 1, title: 'Affordable Reward', points_cost: 100 },
      { id: 2, title: 'Too Expensive', points_cost: 500 },
    ],
    redemptions: [],
    summary: { pointsBalance: 200 },
    redeem: vi.fn(),
    ...overrides,
  })
}

describe('Rewards page', () => {
  it('enables REDEEM for rewards the patient can afford, disables it otherwise', () => {
    mockApp()
    render(<Rewards />)

    const affordableButton = screen.getByText('Affordable Reward').closest('.row-card').querySelector('button')
    const tooExpensiveButton = screen.getByText('Too Expensive').closest('.row-card').querySelector('button')

    expect(affordableButton).not.toBeDisabled()
    expect(tooExpensiveButton).toBeDisabled()
  })

  it('confirms and calls redeem() when an affordable reward is clicked', async () => {
    const redeem = vi.fn()
    mockApp({ redeem })
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    const user = userEvent.setup()

    render(<Rewards />)
    await user.click(screen.getByText('Affordable Reward').closest('.row-card').querySelector('button'))

    expect(redeem).toHaveBeenCalledWith(expect.objectContaining({ id: 1 }))
  })

  it('does not call redeem() if the confirmation is declined', async () => {
    const redeem = vi.fn()
    mockApp({ redeem })
    vi.spyOn(window, 'confirm').mockReturnValue(false)
    const user = userEvent.setup()

    render(<Rewards />)
    await user.click(screen.getByText('Affordable Reward').closest('.row-card').querySelector('button'))

    expect(redeem).not.toHaveBeenCalled()
  })
})
