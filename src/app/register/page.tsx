import Link from "next/link";

import { AuthFrame } from "@/features/auth/ui/AuthFrame";
import { RegisterChoiceGrid } from "@/features/auth/ui/RegisterChoiceGrid";
import { StatusBanner } from "@/features/shared/ui/StatusBanner";

const highlights = [
  "Сначала выбираете сценарий, потом попадаете ровно в свою форму.",
  "Для гостей и владельцев мы показываем разные акценты и разный onboarding.",
  "Если позже понадобится, роли можно развивать отдельными кабинетами и воронками."
];

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function RegisterPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const error = pickValue(searchParams.error);

  return (
    <AuthFrame
      description="Выберите, как хотите работать с Bookit: искать свободные пространства или открывать своё расписание для гостей."
      eyebrow="Регистрация"
      footer={<Link className="secondary-link" href="/login">У меня уже есть аккаунт</Link>}
      highlights={highlights}
      sideTitle="Почему так устроено"
      title="С какой стороны вы входите в Bookit?"
    >
      <StatusBanner error={error} />
      <RegisterChoiceGrid />
    </AuthFrame>
  );
}

function pickValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
