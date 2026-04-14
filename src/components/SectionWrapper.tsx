import { ReactNode } from "react";
import { useReveal } from "@/hooks/useReveal";

interface Props {
  children: ReactNode;
  className?: string;
  id?: string;
}

const SectionWrapper = ({ children, className = "", id }: Props) => {
  const ref = useReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      id={id}
      className={`py-16 md:py-24 reveal ${className}`}
    >
      <div className="container">{children}</div>
    </section>
  );
};

export default SectionWrapper;
