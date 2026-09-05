import { BelarusPhoneInput } from "@/features/shared/ui/BelarusPhoneInput";
import styles from "./auth.module.css";

export function RegistrationFields({ owner }: { owner: boolean }) {
  return <div className={styles.fieldGrid}>
    <label className={styles.field}><span>Имя и фамилия</span>
      <input autoComplete="name" className={styles.input} name="fullName" placeholder="Анна Иванова" required />
    </label>
    <label className={styles.field}><span>Email</span>
      <input autoComplete="email" className={styles.input} name="email" placeholder="name@example.com" required type="email" />
    </label>
    <label className={styles.field}><span>Телефон</span><BelarusPhoneInput className={styles.input} required /></label>
    {owner && <label className={styles.field}><span>Название площадки или бренда</span>
      <input className={styles.input} name="providerTitle" placeholder="North Hall, Loft 17" />
    </label>}
    <label className={styles.field}><span>Пароль</span>
      <input autoComplete="new-password" className={styles.input} name="password" placeholder="Минимум 8 символов" required type="password" />
    </label>
  </div>;
}
