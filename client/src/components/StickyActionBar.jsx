const StickyActionBar = ({ label, onClick }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 border-t border-slate-200 px-4 py-3 pb-safe-area inset-x-0 backdrop-blur dark:bg-slate-950/95 dark:border-slate-800 lg:hidden">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Ready to submit your order?</p>
        <button onClick={onClick} className="rounded-3xl bg-sky-600 px-4 py-3 text-white transition hover:bg-sky-500">
          {label}
        </button>
      </div>
    </div>
  );
};

export default StickyActionBar;

