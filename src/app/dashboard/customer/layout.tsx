import { CustomerTabNav } from "@/features/booking/ui/CustomerTabNav";

export default function CustomerLayout(props: { children: React.ReactNode }) {
  return (
    <div className="stack-large">
      <CustomerTabNav />
      {props.children}
    </div>
  );
}
