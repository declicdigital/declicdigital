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
      className={`py-12 md:py-16 reveal ${className}`}
    >
      <div className="container">{children}</div>
    </section>
  );
};

export default SectionWrapper;
