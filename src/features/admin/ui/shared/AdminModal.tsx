"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";

import { AdminButton } from "./AdminButton";
import { AdminForm } from "./AdminForm";
import { AdminHiddenFields } from "./AdminHiddenFields";
import { AdminSubmitButton } from "./AdminSubmitButton";
import styles from "./adminUi.module.css";

export type AdminModalProps = {
  title: string;
  eyebrow: string;
  action: (formData: FormData) => void | Promise<void>;
  values: Record<string, string>;
  children: ReactNode;
  onClose: () => void;
};

export function AdminModal({ title, eyebrow, action, values, children, onClose }: AdminModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, []);
  return <dialog ref={ref} className={styles.modal} aria-labelledby={titleId} onClose={onClose}>
    <header className={styles.modalHeader}>
      <div><p>{eyebrow}</p><h2 id={titleId}>{title}</h2></div>
      <AdminButton variant="secondary" size="compact" aria-label="Закрыть" onClick={onClose}>×</AdminButton>
    </header>
    <AdminForm action={action}>
      <AdminHiddenFields values={values} />{children}
      <footer className={styles.modalActions}><AdminButton variant="secondary" onClick={onClose}>Отмена</AdminButton><AdminSubmitButton>Сохранить</AdminSubmitButton></footer>
    </AdminForm>
  </dialog>;
}
