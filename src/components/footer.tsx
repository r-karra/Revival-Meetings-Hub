export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-sm">
        <p className="font-bold">Dr. Joseph P. Mosiganti (M.Tech, Ph.D), Founder JBAC, AP.</p>
        <div className="mt-2 flex justify-center items-center gap-x-4 gap-y-1 flex-wrap">
          <a href="mailto:enlight40@jbac.in" className="hover:text-accent transition-colors">
            Email: enlight40@jbac.in
          </a>
          <span className="hidden md:inline">|</span>
          <a href="tel:+17075482182" className="hover:text-accent transition-colors">
            Phone: (707) 548-2182
          </a>
        </div>
      </div>
    </footer>
  );
}
