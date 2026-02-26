import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Shield, Users } from "lucide-react";
import { toast } from "sonner";
import AppHeader from "@/components/AppHeader";
import { getRegistrationById, type MemberRegistration } from "@/lib/data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ADMIN_ID = "suchetan swami";
const ADMIN_PASS = "suchetanswami369";
const ADMIN_SESSION_KEY = "admin_authenticated";

const AdminSubMembers = () => {
  const navigate = useNavigate();
  const { registrationId } = useParams();

  const [adminAuth, setAdminAuth] = useState(() => sessionStorage.getItem(ADMIN_SESSION_KEY) === "true");
  const [adminId, setAdminId] = useState("");
  const [adminPass, setAdminPass] = useState("");
  const [registration, setRegistration] = useState<MemberRegistration | null>(null);
  const [loading, setLoading] = useState(true);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminId.trim().toLowerCase() === ADMIN_ID && adminPass === ADMIN_PASS) {
      setAdminAuth(true);
      sessionStorage.setItem(ADMIN_SESSION_KEY, "true");
      toast.success("એડમિન લોગિન સફળ! 🙏");
    } else {
      toast.error("ખોટો ID અથવા પાસવર્ડ");
    }
  };

  useEffect(() => {
    const load = async () => {
      if (!adminAuth) return;
      if (!registrationId) {
        toast.error("સભ્ય મળ્યો નથી");
        navigate("/admin");
        return;
      }

      try {
        const data = await getRegistrationById(registrationId);
        if (!data) {
          toast.error("રેકોર્ડ મળ્યો નથી");
          navigate("/admin");
          return;
        }
        setRegistration(data);
      } catch {
        toast.error("ડેટા લોડ કરવામાં મુશ્કેલી આવી");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [adminAuth, navigate, registrationId]);

  if (!adminAuth) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <AppHeader title="એડમિન લોગિન" onBack={() => navigate("/admin")} />
        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-sm animate-slide-up">
            <div className="bg-card rounded-xl shadow-card border border-border p-6 md:p-8">
              <div className="text-center mb-6">
                <div className="w-14 h-14 mx-auto mb-3 rounded-2xl gradient-saffron flex items-center justify-center shadow-warm">
                  <Shield className="w-7 h-7 text-primary-foreground" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">એડમિન પેનલ</h2>
                <p className="text-muted-foreground text-sm mt-1">એડમિન ID અને પાસવર્ડ દાખલ કરો</p>
              </div>
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">એડમિન ID</label>
                  <Input value={adminId} onChange={e => setAdminId(e.target.value)} placeholder="એડમિન ID દાખલ કરો" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">પાસવર્ડ</label>
                  <Input type="password" value={adminPass} onChange={e => setAdminPass(e.target.value)} placeholder="પાસવર્ડ દાખલ કરો" />
                </div>
                <Button type="submit" className="w-full gradient-saffron text-primary-foreground hover:opacity-90 h-12 text-lg font-semibold rounded-xl shadow-warm">
                  લોગિન કરો
                </Button>
              </form>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">લોડ થઈ રહ્યું છે...</p>
        </div>
      </div>
    );
  }

  const subMembers = registration?.subMembers || [];

  return (
    <div className="min-h-screen bg-background">
      <AppHeader subtitle="વધારાના સભ્યો" showBack onBack={() => navigate("/admin")} />

      <main className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
        <div className="bg-card rounded-xl shadow-card border border-border mb-6 p-5">
          <h2 className="text-xl font-semibold text-foreground">{registration?.fullName || "—"}</h2>
          <p className="text-sm text-muted-foreground mt-1">સબ-સભ્યોની વિગત</p>
        </div>

        <div className="bg-card rounded-xl shadow-card border border-border">
          <div className="p-5 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground">વધારાના સભ્યો યાદી ({subMembers.length})</h3>
          </div>

          {subMembers.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>આ સભ્ય માટે વધારાના સભ્યો નથી</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-foreground font-semibold">#</TableHead>
                    <TableHead className="text-foreground font-semibold">નામ</TableHead>
                    <TableHead className="text-foreground font-semibold">સંપર્ક</TableHead>
                    <TableHead className="text-foreground font-semibold">વિસ્તાર</TableHead>
                    <TableHead className="text-foreground font-semibold">વ્યવસાય</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subMembers.map((member, index) => (
                    <TableRow key={`${registration?.id}-${index}`} className="hover:bg-primary/5 transition-colors">
                      <TableCell className="text-muted-foreground">{index + 1}</TableCell>
                      <TableCell className="font-medium">{member.name || "—"}</TableCell>
                      <TableCell>{member.contact || "—"}</TableCell>
                      <TableCell>{member.area || "—"}</TableCell>
                      <TableCell>{member.profession || "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminSubMembers;
