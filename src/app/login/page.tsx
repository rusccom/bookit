import { LoginForm } from "@/features/auth/ui/LoginForm";
import { StatusBanner } from "@/features/shared/ui/StatusBanner";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function LoginPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const error = pickValue(searchParams.error);

  return (
    <div className="auth-layout">
      <section className="panel intro-panel">
        <p className="eyebrow">Sign in</p>
        <h1>Вход в систему</h1>
        <p className="lead">
          После входа система сама отправит вас в кабинет клиента или арендодателя.
        </p>
      </section>
      <div className="stack">
        <StatusBanner error={error} />
        <LoginForm />
      </div>
    </div>
  );
}

function pickValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
