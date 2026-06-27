type Service = {
  name: string;
  description: string;
};

const services: Service[] = [
  {
    name: "App development",
    description: "Custom tools and apps built end-to-end, from idea to deployed.",
  },
  {
    name: "Sourcing & finds",
    description: "Tracking down deals and products worth picking up.",
  },
  {
    name: "Consulting",
    description: "Help thinking through a build, a launch, or a business problem.",
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="border-b border-border px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-12 font-display text-4xl tracking-tight sm:text-5xl">
          Services on offer
        </h2>
        <div className="grid gap-px overflow-hidden rounded-2xl border border-border sm:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.name}
              className="bg-background-raised p-8 transition-colors hover:bg-background"
            >
              <h3 className="font-display text-xl text-accent-soft">
                {service.name}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
