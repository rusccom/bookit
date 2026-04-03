import { OwnerTabNav } from "@/features/booking/ui/OwnerTabNav";

export default function OwnerLayout(props: { children: React.ReactNode }) {
  return (
    <div className="stack-large">
      <OwnerTabNav />
      {props.children}
    </div>
  );
}
