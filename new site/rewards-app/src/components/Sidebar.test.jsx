import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Sidebar from './Sidebar'

describe('Sidebar', () => {
  it('renders all five nav tabs', () => {
    render(<Sidebar active="home" onSelect={() => {}} language="EN" onLanguage={() => {}} />)
    for (const label of ['Home', 'Services', 'Shop', 'Rewards', 'Me']) {
      expect(screen.getByText(label)).toBeInTheDocument()
    }
  })

  it('marks the active tab and calls onSelect when another tab is clicked', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(<Sidebar active="home" onSelect={onSelect} language="EN" onLanguage={() => {}} />)

    expect(screen.getByText('Home').closest('button')).toHaveClass('active')
    expect(screen.getByText('Rewards').closest('button')).not.toHaveClass('active')

    await user.click(screen.getByText('Rewards'))
    expect(onSelect).toHaveBeenCalledWith('rewards')
  })

  it('calls onLanguage when a language pill is clicked', async () => {
    const user = userEvent.setup()
    const onLanguage = vi.fn()
    render(<Sidebar active="home" onSelect={() => {}} language="EN" onLanguage={onLanguage} />)

    await user.click(screen.getByText('ES'))
    expect(onLanguage).toHaveBeenCalledWith('ES')
  })
})
