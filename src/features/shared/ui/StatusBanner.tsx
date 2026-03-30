import styles from "./statusBanner.module.css";

type StatusBannerProps = {
  error?: string;
  success?: string;
};

export function StatusBanner(props: StatusBannerProps) {
  if (!props.error && !props.success) {
    return null;
  }

  const className = props.error ? `${styles.banner} ${styles.error}` : `${styles.banner} ${styles.success}`;

  return <div className={className}>{props.error || props.success}</div>;
}
