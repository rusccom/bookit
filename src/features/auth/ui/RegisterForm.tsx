import { registerUserAction } from "@/features/auth/server/authActions";
import type { UserRole } from "@/features/auth/server/authTypes";

type RegisterFormProps = {
  role: UserRole;
};

export function RegisterForm(props: RegisterFormProps) {
  const isOwner = props.role === "owner";

  return (
    <form action={registerUserAction} className="panel form-grid">
      <input name="role" type="hidden" value={props.role} />
      <label>
        <span>Имя</span>
        <input name="fullName" placeholder="Иван Петров" required />
      </label>
      <label>
        <span>Email</span>
        <input name="email" placeholder="name@example.com" required type="email" />
      </label>
      <label>
        <span>Телефон</span>
        <input name="phone" placeholder="+375291112233" required />
      </label>
      {isOwner ? (
        <label>
          <span>Название арендодателя</span>
          <input name="providerTitle" placeholder="Ace Courts Minsk" required />
        </label>
      ) : null}
      <label>
        <span>Пароль</span>
        <input name="password" placeholder="Минимум 8 символов" required type="password" />
      </label>
      <button className="primary-button" type="submit">
        Создать аккаунт
      </button>
    </form>
  );
}
