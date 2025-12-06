interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div
      role="alert"
      style={{
        color: 'red',
        marginBottom: '1rem',
        padding: '0.5rem',
        backgroundColor: '#ffe6e6',
        border: '1px solid #ff9999',
        borderRadius: '4px',
      }}
    >
      <strong>Error:</strong> {message}
    </div>
  );
}
