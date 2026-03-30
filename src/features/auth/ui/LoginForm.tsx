import { loginUserAction } from "@/features/auth/server/authActions";

export function LoginForm() {
  return (
    <form action={loginUserAction} className="panel form-grid">
      <label>
        <span>Email</span>
        <input name="email" placeholder="name@example.com" required type="email" />
      </label>
      <label>
        <span>Пароль</span>
        <input name="password" placeholder="Ваш пароль" required type="password" />
      </label>
      <button className="primary-button" type="submit">
        Войти
      </button>
    </form>
  );
}
