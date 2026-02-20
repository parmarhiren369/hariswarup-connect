import { Sun } from "lucide-react";

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
}

const AppHeader = ({ title = "હરિસ્વરૂપ પ્રદેશ", subtitle, showBack, onBack }: AppHeaderProps) => {
  return (
    <header className="gradient-maroon text-primary-foreground py-5 px-6 shadow-warm">
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
          <div className="w-10 h-10 rounded-full gradient-saffron flex items-center justify-center shadow-warm">
            <Sun className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wide">{title}</h1>
            {subtitle && <p className="text-sm text-primary-foreground/70">{subtitle}</p>}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
