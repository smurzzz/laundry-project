import { Link } from 'react-router-dom';
import { ArrowRightIcon, CheckBadgeIcon, ClockIcon, SparklesIcon, TruckIcon, ShieldCheckIcon, ChartBarIcon, BanknotesIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import logo from '../assets/laundryLogo.png';

const highlights = [
  { label: 'Pickup speed', value: 'Same-day' },
  { label: 'Average rating', value: '4.9/5' },
  { label: 'Status updates', value: 'Live' },
];

const features = [
  {
    icon: TruckIcon,
    title: 'Pickup and delivery built in',
    description: 'Schedule collections, track progress, and keep every order moving without back-and-forth.',
  },
  {
    icon: ClockIcon,
    title: 'Real-time order visibility',
    description: 'See where each load is, what stage it is in, and when it is ready for delivery.',
  },
  {
    icon: ShieldCheckIcon,
    title: 'Reliable and secure',
    description: 'Account access, order notes, and payment history stay organized in one place.',
  },
  {
    icon: BanknotesIcon,
    title: 'Simple billing',
    description: 'View payment history and manage services from a clean, easy-to-read dashboard.',
  },
];

const steps = [
  'Book your laundry pickup from the web app.',
  'We process, wash, and update the order in real time.',
  'Receive your finished laundry on the schedule you choose.',
];

const footerLinks = [
  { label: 'Get started', to: '/register' },
  { label: 'Sign in', to: '/login' },
  { label: 'Admin access', to: '/admin/login' },
];

const LandingPage = () => {
  const { user } = useAuth();
  const dashboardPath = user?.role === 'admin' ? '/admin' : '/customer';

  return (
    <div className="space-y-16 pb-10 lg:space-y-24">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/75 px-6 py-14 shadow-[0_30px_120px_-56px_rgba(15,23,42,0.45)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/75 sm:px-10 lg:px-14 lg:py-20">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 top-10 h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-sky-300/20 blur-3xl" />
        </div>

        <div className="relative grid gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <div>
            <p className="app-kicker inline-flex items-center gap-2 rounded-full border border-cyan-200/70 bg-cyan-50/90 px-3 py-1 text-cyan-700 dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-200">
              <SparklesIcon className="h-4 w-4" />
              Modern laundry management
            </p>
            <h1 className="mt-6 max-w-3xl text-4xl font-black tracking-tight text-slate-950 dark:text-white sm:text-5xl lg:text-6xl">
              Laundry service that feels as polished as your workspace.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300 sm:text-lg">
              CleanWash keeps pickups, delivery notes, service updates, and payments in one calm, modern dashboard so customers can order faster and staff can stay organized.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {user ? (
                <Link to={dashboardPath} className="app-button-primary">
                  Open dashboard
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
              ) : (
                <Link to="/register" className="app-button-primary">
                  Get started
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
              )}
              <Link to="/login" className="app-button">
                Sign in
              </Link>
              <Link to="/admin/login" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200/80 bg-white/70 px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-white dark:border-white/10 dark:bg-slate-950/50 dark:text-slate-200 dark:hover:bg-slate-900">
                Admin access
              </Link>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {highlights.map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/70 bg-white/70 p-4 backdrop-blur dark:border-white/10 dark:bg-slate-950/40">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{item.label}</p>
                  <p className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex flex-col items-center justify-center">
            <div className="absolute -inset-8 rounded-[2rem] bg-gradient-to-br from-purple-500/20 via-transparent to-pink-600/20 blur-3xl" />
            <img src={logo} alt="CleanWash" className="relative h-40 w-40 drop-shadow-lg mb-6" />
            <div className="relative space-y-4 rounded-[2rem] border border-white/70 bg-slate-950/95 p-5 text-white shadow-[0_28px_90px_-46px_rgba(15,23,42,0.8)] dark:border-white/10 sm:p-6">
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200/75">Active order</p>
                  <p className="mt-1 text-lg font-bold">Order #CW-2048</p>
                </div>
                <span className="rounded-full bg-cyan-400/15 px-3 py-1 text-xs font-semibold text-cyan-200">In transit</span>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { label: 'Ordered', value: '10:12 AM' },
                  { label: 'Processing', value: '12:40 PM' },
                  { label: 'Delivery', value: 'Today' },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-white/45">{item.label}</p>
                    <p className="mt-2 text-base font-semibold text-white">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-cyan-500/15 to-blue-600/10 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/20 text-cyan-200">
                    <ChartBarIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Dashboard-ready operations</p>
                    <p className="text-sm text-white/65">Monitor orders, services, and payments from one place.</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
                  {['Pickup route', 'Service notes', 'Payment history', 'Support tickets'].map((item) => (
                    <span key={item} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/80">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <article key={feature.title} className="app-card h-full">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-200">
                <Icon className="h-6 w-6" />
              </div>
              <h2 className="mt-5 text-lg font-bold text-slate-950 dark:text-white">{feature.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{feature.description}</p>
            </article>
          );
        })}
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.96fr_1.04fr] lg:items-start">
        <article className="app-card">
          <p className="app-kicker">How it works</p>
          <h2 className="mt-3 text-2xl font-bold text-slate-950 dark:text-white">A smoother flow from booking to delivery.</h2>
          <div className="mt-6 space-y-4">
            {steps.map((step, index) => (
              <div key={step} className="flex gap-4 rounded-2xl border border-slate-200/70 bg-slate-50/70 p-4 dark:border-white/10 dark:bg-slate-950/35">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-sm font-bold text-white dark:bg-white dark:text-slate-950">
                  {index + 1}
                </div>
                <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{step}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="app-card overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="app-kicker">Built for trust</p>
              <h2 className="mt-3 text-2xl font-bold text-slate-950 dark:text-white">Clear status, fewer follow-ups.</h2>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300">
              <CheckBadgeIcon className="h-6 w-6" />
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              'Live order updates for customers',
              'Fast access to service history',
              'Admin tools for services and support',
              'A clean mobile-friendly interface',
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-2xl border border-slate-200/70 bg-white/70 p-4 dark:border-white/10 dark:bg-slate-950/35">
                <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500/15 text-cyan-600 dark:text-cyan-300">
                  <CheckBadgeIcon className="h-4 w-4" />
                </span>
                <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{item}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-[1.5rem] bg-gradient-to-r from-cyan-500 to-blue-600 p-6 text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/75">Ready to start</p>
            <p className="mt-2 max-w-xl text-lg font-semibold">Create an account and start managing your laundry orders with a modern dashboard.</p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Link to="/register" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5">
                Create account
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <Link to="/login" className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/15">
                Sign in
              </Link>
            </div>
          </div>
        </article>
      </section>

      <footer className="rounded-[2rem] border border-white/70 bg-slate-950 px-6 py-10 text-white shadow-[0_30px_120px_-56px_rgba(15,23,42,0.45)] dark:border-white/10 sm:px-10">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div>
            <p className="app-kicker text-cyan-200">Contact us</p>
            <h2 className="mt-3 text-2xl font-bold">We're here to help with orders, support, and account questions.</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">
              Reach out anytime for laundry service inquiries, pickup coordination, or account assistance.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/50">Phone</p>
            <a href="tel:09928245215" className="mt-3 block text-lg font-semibold text-white transition hover:text-cyan-200">
              09928245215
            </a>
            <p className="mt-4 text-sm font-semibold uppercase tracking-[0.18em] text-white/50">Email</p>
            <a href="mailto:hansargate10@gmail.com" className="mt-3 block text-lg font-semibold text-white transition hover:text-cyan-200">
              hansargate10@gmail.com
            </a>
            <p className="mt-4 text-sm font-semibold uppercase tracking-[0.18em] text-white/50">Location</p>
            <p className="mt-3 text-lg font-semibold text-white">
              Blk28 Maswerte St. Lupang Arenda Taytay Rizal
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/50">Quick links</p>
            <ul className="mt-3 space-y-3">
              {footerLinks.map((item) => (
                <li key={item.label}>
                  <Link to={item.to} className="text-sm text-white/80 transition hover:text-cyan-200">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>CleanWash Laundry Hub</p>
          <p>Fast pickup, tidy updates, and friendly support.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
