import { render, screen } from '@testing-library/react';
import { ErrorMessage } from '../../components/ErrorMessage';

describe('ErrorMessage', () => {
  it('displays the error message', () => {
    render(<ErrorMessage message="Something went wrong" />);

    expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong');
  });
});
