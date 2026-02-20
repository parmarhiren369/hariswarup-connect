import { useNavigate } from "react-router-dom";
import { Shield, UserPlus } from "lucide-react";
import logo from "@/assets/logo.png";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="gradient-saffron text-primary-foreground py-10 px-6 text-center">
        <div className="animate-fade-in">
          <img src={logo} alt="હરિપ્રબોધમ્ Logo" className="w-24 h-24 mx-auto mb-4 drop-shadow-lg" />
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-wide">હરિસ્વરૂપ પ્રદેશ</h1>
          <p className="text-primary-foreground/80 mt-2 text-lg">સત્સંગ એપ</p>
          <div className="w-24 h-1 bg-primary-foreground/40 mx-auto mt-4 rounded-full" />
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
            className="group bg-card rounded-2xl shadow-card border border-border p-8 text-center hover:shadow-warm hover:border-primary/30 transition-all duration-300 hover:-translate-y-1"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl gradient-saffron flex items-center justify-center shadow-warm group-hover:scale-110 transition-transform duration-300">
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
