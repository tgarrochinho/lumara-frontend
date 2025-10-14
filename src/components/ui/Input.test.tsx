import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from './Input'

describe('Input', () => {
  it('renders input element', () => {
    render(<Input placeholder="Enter text" />)
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
  })

  it('applies glass-morphism styles by default', () => {
    render(<Input data-testid="input" />)
    const input = screen.getByTestId('input')
    expect(input).toHaveClass('bg-white/5', 'border', 'border-white/10')
  })

  it('applies focus ring styles', () => {
    render(<Input data-testid="input" />)
    const input = screen.getByTestId('input')
    expect(input).toHaveClass('focus:outline-none', 'focus:ring-2', 'focus:ring-brand-indigo')
  })

  it('handles text input', async () => {
    const user = userEvent.setup()
    render(<Input data-testid="input" />)
    const input = screen.getByTestId('input') as HTMLInputElement

    await user.type(input, 'Hello World')
    expect(input.value).toBe('Hello World')
  })

  it('shows error border when error prop is provided', () => {
    render(<Input data-testid="input" error="This field is required" />)
    const input = screen.getByTestId('input')
    expect(input).toHaveClass('border-red-500')
  })

  it('displays error message when error prop is provided', () => {
    render(<Input error="This field is required" />)
    expect(screen.getByText('This field is required')).toBeInTheDocument()
  })

  it('does not display error message when no error', () => {
    render(<Input placeholder="No error" />)
    const errorElement = screen.queryByRole('alert')
    expect(errorElement).not.toBeInTheDocument()
  })

  it('accepts custom className', () => {
    render(<Input className="custom-input" data-testid="input" />)
    const input = screen.getByTestId('input')
    expect(input).toHaveClass('custom-input')
  })

  it('can be disabled', () => {
    render(<Input disabled data-testid="input" />)
    const input = screen.getByTestId('input')
    expect(input).toBeDisabled()
  })

  it('forwards ref to input element', () => {
    const ref = vi.fn()
    render(<Input ref={ref} />)
    expect(ref).toHaveBeenCalled()
  })

  it('spreads additional props to input element', () => {
    render(
      <Input
        data-testid="input"
        type="email"
        name="email"
        required
        aria-label="Email address"
      />
    )
    const input = screen.getByTestId('input')
    expect(input).toHaveAttribute('type', 'email')
    expect(input).toHaveAttribute('name', 'email')
    expect(input).toHaveAttribute('required')
    expect(input).toHaveAttribute('aria-label', 'Email address')
  })

  it('handles placeholder text', () => {
    render(<Input placeholder="Enter your name" />)
    const input = screen.getByPlaceholderText('Enter your name')
    expect(input).toHaveClass('placeholder:text-white/40')
  })

  it('handles onChange events', async () => {
    const handleChange = vi.fn()
    const user = userEvent.setup()

    render(<Input onChange={handleChange} data-testid="input" />)
    const input = screen.getByTestId('input')

    await user.type(input, 'a')
    expect(handleChange).toHaveBeenCalled()
  })

  it('wraps input in container div', () => {
    const { container } = render(<Input data-testid="input" />)
    const wrapper = container.querySelector('div')
    expect(wrapper).toHaveClass('flex', 'flex-col', 'gap-1')
  })
})
