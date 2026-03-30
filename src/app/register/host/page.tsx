import Link from "next/link";

import { AuthFrame } from "@/features/auth/ui/AuthFrame";
import { RegisterForm } from "@/features/auth/ui/RegisterForm";
import { StatusBanner } from "@/features/shared/ui/StatusBanner";

const highlights = [
  "Откройте своё расписание и принимайте брони без ручной переписки.",
  "Управляйте объектами, слотами и загрузкой из отдельного кабинета.",
  "Получите фундамент для веб-бронирования, SMS-подтверждений и Telegram-сценариев."
];

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function RegisterHostPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const error = pickValue(searchParams.error);

  return (
    <AuthFrame
      description="Создайте аккаунт владельца, чтобы публиковать пространство, открывать слоты и контролировать бронирования."
      eyebrow="Владелец"
      footer={<Link className="secondary-link" href="/register">Выбрать другой сценарий</Link>}
      highlights={highlights}
      sideTitle="Что вы получите"
      title="Аккаунт для тех, кто сдаёт пространство"
    >
      <StatusBanner error={error} />
      <RegisterForm role="owner" />
    </AuthFrame>
  );
}

function pickValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
