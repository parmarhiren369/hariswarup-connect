import { useState } from "react";
import { Navigate } from "react-router-dom";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useAuth } from "@/contexts/AuthContext";
import { auth } from "@/lib/firebase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import logo from "@/assets/logo.png";
import { LogIn, UserPlus } from "lucide-react";

const Auth = () => {
  const { user, loading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("કૃપા કરીને ઈમેલ અને પાસવર્ડ દાખલ કરો");
      return;
    }
    if (password.length < 6) {
      toast.error("પાસવર્ડ ઓછામાં ઓછા 6 અક્ષરનો હોવો જોઈએ");
      return;
    }

    setSubmitting(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("લોગિન સફળ! 🙏");
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        toast.success("એકાઉન્ટ બનાવ્યું! 🙏");
      }
    } catch (err: any) {
      const code = err?.code || "";
      if (code === "auth/user-not-found" || code === "auth/invalid-credential") {
        toast.error("ઈમેલ અથવા પાસવર્ડ ખોટો છે");
      } else if (code === "auth/email-already-in-use") {
        toast.error("આ ઈમેલ પહેલાથી રજિસ્ટર છે");
      } else if (code === "auth/weak-password") {
        toast.error("પાસવર્ડ ખૂબ નબળો છે");
      } else if (code === "auth/invalid-email") {
        toast.error("ઈમેલ માન્ય નથી");
      } else {
        toast.error("કંઈક ખોટું થયું, ફરી પ્રયાસ કરો");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="gradient-saffron text-primary-foreground py-10 px-6 text-center">
        <div className="animate-fade-in">
          <img src={logo} alt="Logo" className="w-24 h-24 mx-auto mb-4 drop-shadow-lg" />
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-wide">હરિસ્વરૂપ પ્રદેશ</h1>
          <p className="text-primary-foreground/80 mt-2 text-lg">સત્સંગ એપ</p>
          <div className="w-24 h-1 bg-primary-foreground/40 mx-auto mt-4 rounded-full" />
        </div>
      </header>

      {/* Auth Form */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md animate-slide-up">
          <div className="bg-card rounded-xl shadow-card border border-border p-6 md:p-8">
            <div className="text-center mb-6">
              <div className="w-14 h-14 mx-auto mb-3 rounded-2xl gradient-saffron flex items-center justify-center shadow-warm">
                {isLogin ? <LogIn className="w-7 h-7 text-primary-foreground" /> : <UserPlus className="w-7 h-7 text-primary-foreground" />}
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                {isLogin ? "લોગિન" : "સાઇન અપ"}
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                {isLogin ? "તમારા એકાઉન્ટમાં લોગિન કરો" : "નવું એકાઉન્ટ બનાવો"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-foreground">ઈમેલ</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="તમારું ઈમેલ દાખલ કરો"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-foreground">પાસવર્ડ</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="પાસવર્ડ દાખલ કરો"
                />
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full gradient-saffron text-primary-foreground hover:opacity-90 transition-opacity h-12 text-lg font-semibold rounded-xl shadow-warm"
              >
                {submitting ? "રાહ જુઓ..." : isLogin ? "લોગિન કરો" : "સાઇન અપ કરો"}
              </Button>
            </form>

            <div className="text-center mt-6">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-primary hover:underline font-medium"
              >
                {isLogin
                  ? "એકાઉન્ટ નથી? સાઇન અપ કરો"
                  : "પહેલાથી એકાઉન્ટ છે? લોગિન કરો"}
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="text-center py-4 text-xs text-muted-foreground">
        જય સ્વામિનારાયણ 🙏 | હરિસ્વરૂપ પ્રદેશ
      </footer>
    </div>
  );
};

export default Auth;
