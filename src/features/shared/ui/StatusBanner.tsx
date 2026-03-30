type StatusBannerProps = {
  error?: string;
  success?: string;
};

export function StatusBanner(props: StatusBannerProps) {
  if (!props.error && !props.success) {
    return null;
  }

  return (
    <div className={props.error ? "status status-error" : "status status-success"}>
      {props.error || props.success}
    </div>
  );
}
