import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Card } from './Card'

describe('Card', () => {
  it('renders with children content', () => {
    render(<Card>Card content</Card>)
    expect(screen.getByText('Card content')).toBeInTheDocument()
  })

  it('applies glass-morphism styles by default', () => {
    render(<Card data-testid="card">Glass Card</Card>)
    const card = screen.getByTestId('card')
    expect(card).toHaveClass('bg-white/5', 'border', 'border-white/10')
  })

  it('applies rounded corners and padding', () => {
    render(<Card data-testid="card">Styled Card</Card>)
    const card = screen.getByTestId('card')
    expect(card).toHaveClass('rounded-xl', 'p-6')
  })

  it('accepts custom className', () => {
    render(<Card className="custom-card" data-testid="card">Custom</Card>)
    const card = screen.getByTestId('card')
    expect(card).toHaveClass('custom-card')
  })

  it('forwards ref to div element', () => {
    const ref = vi.fn()
    render(<Card ref={ref}>Ref Card</Card>)
    expect(ref).toHaveBeenCalled()
  })

  it('spreads additional props to div element', () => {
    render(<Card data-testid="test-card" role="article">Props Card</Card>)
    const card = screen.getByTestId('test-card')
    expect(card).toHaveAttribute('role', 'article')
  })

  it('renders nested content correctly', () => {
    render(
      <Card>
        <h2>Card Title</h2>
        <p>Card description</p>
      </Card>
    )
    expect(screen.getByText('Card Title')).toBeInTheDocument()
    expect(screen.getByText('Card description')).toBeInTheDocument()
  })

  it('can be composed with other elements', () => {
    render(
      <Card data-testid="outer-card">
        <Card className="nested-card" data-testid="nested-card">Nested Card</Card>
      </Card>
    )
    const nestedCard = screen.getByTestId('nested-card')
    expect(nestedCard).toHaveClass('nested-card')
  })
})
