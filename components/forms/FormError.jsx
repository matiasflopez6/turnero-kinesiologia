export default function FormError({ state }) {
  if (!state?.error) return null;
  return (
    <p className="form-error" role="alert">
      {state.error}
    </p>
  );
}
