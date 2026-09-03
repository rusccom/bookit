import type { AdminUserNote } from "@/features/admin/server/adminUserNotesTypes";
import { AdminCard } from "./shared/AdminCard";
import { AdminUserNoteForm } from "./AdminUserNoteForm";
import styles from "./adminUserNotes.module.css";

export function AdminUserNotes({ notes, userId }: { notes: AdminUserNote[]; userId: string }) {
  return <section id="notes"><AdminCard title="Внутренние заметки" description="Видны только администраторам. Показаны последние 50 заметок; автор и время сохраняются.">
    <AdminUserNoteForm userId={userId} />
    {!notes.length && <p>Заметок пока нет.</p>}
    {notes.map((note) => <article className={styles.note} key={note.id}>
      <header><strong>{note.authorLogin}</strong><time dateTime={note.createdAt}>{formatNoteDate(note.createdAt)}</time></header>
      <p>{note.body}</p>
    </article>)}
  </AdminCard></section>;
}

function formatNoteDate(value: string) {
  return new Intl.DateTimeFormat("ru-BY", { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Minsk" }).format(new Date(value));
}
