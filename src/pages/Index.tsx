import { useNavigate } from "react-router-dom";
import { Sun, Shield, UserPlus } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen gradient-warm flex flex-col">
      {/* Header */}
      <header className="gradient-maroon text-primary-foreground py-8 px-6 text-center">
        <div className="animate-fade-in">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full gradient-saffron flex items-center justify-center shadow-warm">
            <Sun className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-wide">હરિસ્વરૂપ પ્રદેશ</h1>
          <p className="text-primary-foreground/70 mt-2 text-lg">સત્સંગ એપ</p>
          <div className="w-24 h-1 gradient-saffron mx-auto mt-4 rounded-full" />
        </div>
      </header>

      {/* Portal Selection */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-xl w-full animate-slide-up">
          {/* User Portal */}
          <button
            onClick={() => navigate("/register")}
            className="group bg-card rounded-2xl shadow-card border border-border p-8 text-center hover:shadow-warm hover:border-primary/30 transition-all duration-300 hover:-translate-y-1"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl gradient-saffron flex items-center justify-center shadow-warm group-hover:scale-110 transition-transform duration-300">
              <UserPlus className="w-8 h-8 text-primary-foreground" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">સભ્ય નોંધણી</h2>
            <p className="text-sm text-muted-foreground">નવી નોંધણી કરવા માટે અહીં ક્લિક કરો</p>
          </button>

          {/* Admin Portal */}
          <button
            onClick={() => navigate("/admin")}
            className="group bg-card rounded-2xl shadow-card border border-border p-8 text-center hover:shadow-warm hover:border-maroon/30 transition-all duration-300 hover:-translate-y-1"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl gradient-maroon flex items-center justify-center shadow-warm group-hover:scale-110 transition-transform duration-300">
              <Shield className="w-8 h-8 text-primary-foreground" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">એડમિન પેનલ</h2>
            <p className="text-sm text-muted-foreground">સભ્ય ડેટા જોવા અને સંચાલન કરવા</p>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-xs text-muted-foreground">
        જય સ્વામિનારાયણ 🙏 | હરિસ્વરૂપ પ્રદેશ
      </footer>
    </div>
  );
};

export default Index;
