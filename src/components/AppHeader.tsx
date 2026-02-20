import logo from "@/assets/logo.png";

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
}

const AppHeader = ({ title = "હરિસ્વરૂપ પ્રદેશ", subtitle, showBack, onBack }: AppHeaderProps) => {
  return (
    <header className="gradient-saffron text-primary-foreground py-4 px-6 shadow-warm">
      <div className="max-w-5xl mx-auto flex items-center gap-4">
        {showBack && (
          <button
            onClick={onBack}
            className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-lg"
          >
            ← પાછા
          </button>
        )}
        <div className="flex items-center gap-3 flex-1">
          <img src={logo} alt="Logo" className="w-10 h-10 drop-shadow" />
          <div>
            <h1 className="text-xl font-bold tracking-wide">{title}</h1>
            {subtitle && <p className="text-sm text-primary-foreground/80">{subtitle}</p>}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
