import { confirmRegistrationAction } from "@/features/auth/server/authActions";

export function RegisterVerificationForm() {
  return (
    <form action={confirmRegistrationAction} className="panel form-grid">
      <label>
        <span>Код из SMS</span>
        <input
          autoComplete="one-time-code"
          inputMode="numeric"
          name="code"
          placeholder="123456"
          required
        />
      </label>
      <button className="primary-button" type="submit">
        Подтвердить регистрацию
      </button>
    </form>
  );
}
