import Link from "next/link";

import { AuthFrame } from "@/features/auth/ui/AuthFrame";
import { RegisterForm } from "@/features/auth/ui/RegisterForm";
import { StatusBanner } from "@/features/shared/ui/StatusBanner";

const highlights = [
  "Находите свободные корты, студии, залы и другие пространства без звонков.",
  "Получайте быстрый вход в личный кабинет и будущие сценарии через Telegram.",
  "Держите свои бронирования и подтверждения в одном месте."
];

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function RegisterGuestPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const error = pickValue(searchParams.error);

  return (
    <AuthFrame
      description="Создайте аккаунт гостя, чтобы быстро находить свободные слоты и бронировать удобное время."
      eyebrow="Гость"
      footer={<Link className="secondary-link" href="/register">Выбрать другой сценарий</Link>}
      highlights={highlights}
      sideTitle="Что вы получите"
      title="Аккаунт для тех, кто хочет бронировать"
    >
      <StatusBanner error={error} />
      <RegisterForm role="customer" />
    </AuthFrame>
  );
}

function pickValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
