import Link from "next/link";

import { registerUserAction } from "@/features/auth/server/authActions";
import type { UserRole } from "@/features/auth/server/authTypes";

type RegisterFormProps = {
  role: UserRole;
};

export function RegisterForm(props: RegisterFormProps) {
  const isOwner = props.role === "owner";

  return (
    <form action={registerUserAction} className="panel auth-card form-grid">
      <input name="role" type="hidden" value={props.role} />
      <header className="form-header">
        <h2>{isOwner ? "Запускаем кабинет владельца" : "Создаём кабинет гостя"}</h2>
        <p className="muted">{isOwner ? "После этого вы сможете добавлять объекты и открывать слоты." : "После этого вы сможете искать свободные пространства и бронировать их."}</p>
      </header>
      <label>
        <span>Как к вам обращаться</span>
        <input autoComplete="name" name="fullName" placeholder="Анна Иванова" required />
      </label>
      <label>
        <span>Email</span>
        <input autoComplete="email" name="email" placeholder="name@example.com" required type="email" />
      </label>
      <label>
        <span>Телефон</span>
        <input autoComplete="tel" name="phone" placeholder="+375291112233" required />
      </label>
      {isOwner ? (
        <label>
          <span>Название пространства или бренда</span>
          <input name="providerTitle" placeholder="North Hall, Ace Courts, Loft 17" />
        </label>
      ) : null}
      <label>
        <span>Пароль</span>
        <input autoComplete="new-password" name="password" placeholder="Минимум 8 символов" required type="password" />
      </label>
      <button className="primary-button" type="submit">Создать аккаунт</button>
      <p className="form-hint">Уже зарегистрированы? <Link href="/login">Войти в кабинет</Link>.</p>
    </form>
  );
}
