import { confirmRegistrationAction } from "@/features/auth/server/authActions";

export function RegisterVerificationForm() {
  return (
    <form action={confirmRegistrationAction} className="panel auth-card form-grid">
      <header className="form-header">
        <h2>Подтвердите номер</h2>
        <p className="muted">Введите код из SMS. Обычно сообщение приходит в течение нескольких секунд.</p>
      </header>
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
      <button className="primary-button" type="submit">Подтвердить регистрацию</button>
    </form>
  );
}
