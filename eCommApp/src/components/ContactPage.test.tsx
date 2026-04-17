import { render, screen } from '../test/test-utils';
import { describe, it, expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import ContactPage from './ContactPage';

describe('ContactPage', () => {
  it('renders contact form fields and submit button', () => {
    render(<ContactPage />);

    expect(screen.getByRole('heading', { name: 'Contact Us' })).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    expect(screen.getByLabelText('Issue')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });

  it('accepts input and submits without persisting values', async () => {
    const user = userEvent.setup();
    render(<ContactPage />);

    const nameInput = screen.getByLabelText('Name');
    const emailInput = screen.getByLabelText('Email Address');
    const issueInput = screen.getByLabelText('Issue');
    const submitButton = screen.getByRole('button', { name: 'Submit' });

    await user.type(nameInput, 'Jane Doe');
    await user.type(emailInput, 'jane@example.com');
    await user.type(issueInput, 'Need help with an order');
    await user.click(submitButton);

    expect(nameInput).toHaveValue('');
    expect(emailInput).toHaveValue('');
    expect(issueInput).toHaveValue('');
  });
});
