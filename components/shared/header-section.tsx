interface HeaderSectionProps {
  label?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
}

export function HeaderSection({ label, title, subtitle, centered }: HeaderSectionProps) {
  return (
    <div className={`flex flex-col ${centered ? 'items-center text-center' : ''}`}>
      {label ? (
        <div className="text-gradient_indigo-purple mb-4 font-semibold">
          {label}
        </div>
      ) : null}
      <h2 className="font-heading text-3xl md:text-4xl lg:text-[40px]">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-6 text-balance text-lg text-muted-foreground">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
