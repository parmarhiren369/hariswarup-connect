import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppHeader from "@/components/AppHeader";
import { listenRegistrations, deleteRegistration, type MemberRegistration } from "@/lib/data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Search, Trash2, Eye, Users, Download, UserPlus, Shield } from "lucide-react";

const ADMIN_ID = "suchetan swami";
const ADMIN_PASS = "suchetanswami369";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState<MemberRegistration[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<MemberRegistration | null>(null);
  const [showSubMembers, setShowSubMembers] = useState<MemberRegistration | null>(null);
  const [adminAuth, setAdminAuth] = useState(false);
  const [adminId, setAdminId] = useState("");
  const [adminPass, setAdminPass] = useState("");

  useEffect(() => {
    if (!adminAuth) return;

    const unsubscribe = listenRegistrations(
      (data) => setRegistrations(data),
      () => toast.error("ડેટા લોડ કરવામાં મુશ્કેલી આવી"),
    );

    return unsubscribe;
  }, [adminAuth]);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminId.trim().toLowerCase() === ADMIN_ID && adminPass === ADMIN_PASS) {
      setAdminAuth(true);
      toast.success("એડમિન લોગિન સફળ! 🙏");
    } else {
      toast.error("ખોટો ID અથવા પાસવર્ડ");
    }
  };

  if (!adminAuth) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <AppHeader title="એડમિન લોગિન" onBack={() => navigate("/")} />
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

  const filtered = registrations.filter((r) =>
    `${r.fullName} ${r.fatherName} ${r.surname} ${r.mobile} ${r.area}`.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    try {
      await deleteRegistration(id);
      toast.success("રેકોર્ડ કાઢી નાખ્યો");
    } catch {
      toast.error("રેકોર્ડ કાઢવામાં મુશ્કેલી આવી");
    }
  };

  const exportCSV = () => {
    if (registrations.length === 0) {
      toast.error("એક્સપોર્ટ કરવા માટે કોઈ ડેટા નથી");
      return;
    }
    const headers = [
      "પૂરું નામ", "ફાધર નામ", "સરનેમ", "જન્મ તારીખ",
      "વૈવાહિક સ્થિતિ", "વ્યવસાય", "મોબાઈલ", "વોટ્સએપ",
      "વિસ્તાર", "નોંધણી તારીખ", "વધારાના સભ્યો"
    ];
    const rows = registrations.map((r) => [
      r.fullName, r.fatherName, r.surname, r.birthDate,
      r.maritalStatus, r.occupation, r.mobile, r.whatsapp,
      r.area,
      r.registeredAt,
      r.subMembers ? r.subMembers.map((s) => `${s.name}(${s.contact})`).join("; ") : "",
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.map((v) => `"${v}"`).join(","))].join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "satsang_members.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV ડાઉનલોડ થયું");
  };

  const exportSubMembersCSV = () => {
    const allSub: { parent: string; name: string; contact: string; area: string; profession: string }[] = [];
    registrations.forEach((r) => {
      (r.subMembers || []).forEach((s) => {
        allSub.push({ parent: r.fullName, name: s.name, contact: s.contact, area: s.area, profession: s.profession });
      });
    });
    if (allSub.length === 0) {
      toast.error("કોઈ વધારાના સભ્યો નથી");
      return;
    }
    const headers = ["મુખ્ય સભ્ય", "નામ", "સંપર્ક", "વિસ્તાર", "વ્યવસાય"];
    const rows = allSub.map((s) => [s.parent, s.name, s.contact, s.area, s.profession]);
    const csv = [headers.join(","), ...rows.map((r) => r.map((v) => `"${v}"`).join(","))].join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sub_members.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("વધારાના સભ્યો CSV ડાઉનલોડ થયું");
  };

  const totalSubMembers = registrations.reduce((acc, r) => acc + (r.subMembers?.length || 0), 0);

  const DetailRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex justify-between py-2 border-b border-border last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground">{value || "—"}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <AppHeader subtitle="એડમિન ડેશબોર્ડ" showBack onBack={() => navigate("/")} />

      <main className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-card rounded-xl shadow-card border border-border p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl gradient-saffron flex items-center justify-center">
              <Users className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{registrations.length}</p>
              <p className="text-sm text-muted-foreground">કુલ સભ્યો</p>
            </div>
          </div>
          <div className="bg-card rounded-xl shadow-card border border-border p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl gradient-saffron flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{totalSubMembers}</p>
              <p className="text-sm text-muted-foreground">વધારાના સભ્યો</p>
            </div>
          </div>
        </div>

        {/* Main Members Table */}
        <div className="bg-card rounded-xl shadow-card border border-border mb-6">
          <div className="p-5 border-b border-border flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">સભ્ય યાદી</h2>
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="શોધો..." className="pl-9 w-full sm:w-64" />
              </div>
              <Button variant="outline" size="sm" onClick={exportCSV} className="gap-1.5">
                <Download className="w-4 h-4" /> CSV
              </Button>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>કોઈ રેકોર્ડ મળ્યા નથી</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-foreground font-semibold">#</TableHead>
                    <TableHead className="text-foreground font-semibold">પૂરું નામ</TableHead>
                    <TableHead className="text-foreground font-semibold">સરનેમ</TableHead>
                    <TableHead className="text-foreground font-semibold">મોબાઈલ</TableHead>
                     <TableHead className="text-foreground font-semibold">વિસ્તાર</TableHead>
                    <TableHead className="text-foreground font-semibold">સબ-સભ્યો</TableHead>
                    <TableHead className="text-foreground font-semibold text-right">ક્રિયાઓ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((r, i) => (
                    <TableRow key={r.id} className="hover:bg-primary/5 transition-colors">
                      <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                      <TableCell className="font-medium">{r.fullName}</TableCell>
                      <TableCell>{r.surname}</TableCell>
                      <TableCell>{r.mobile}</TableCell>
                      <TableCell>{r.area || "—"}</TableCell>
                      <TableCell>
                        {r.subMembers && r.subMembers.length > 0 ? (
                          <Button variant="link" size="sm" className="text-primary p-0 h-auto" onClick={() => setShowSubMembers(r)}>
                            {r.subMembers.length} સભ્યો
                          </Button>
                        ) : "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-1 justify-end">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelected(r)}>
                                <Eye className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle className="text-lg">સભ્ય વિગતો</DialogTitle>
                              </DialogHeader>
                              {selected && (
                                <div className="space-y-0">
                                  <DetailRow label="પૂરું નામ" value={selected.fullName} />
                                  <DetailRow label="ફાધર નામ" value={selected.fatherName} />
                                  <DetailRow label="સરનેમ" value={selected.surname} />
                                  <DetailRow label="જન્મ તારીખ" value={selected.birthDate} />
                                  <DetailRow label="વૈવાહિક સ્થિતિ" value={selected.maritalStatus} />
                                  <DetailRow label="વ્યવસાય" value={selected.occupation} />
                                  <DetailRow label="મોબાઈલ" value={selected.mobile} />
                                  <DetailRow label="વોટ્સએપ" value={selected.whatsapp} />
                                  <DetailRow label="વિસ્તાર" value={selected.area} />
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => void handleDelete(r.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {/* Sub Members Table */}
        {totalSubMembers > 0 && (
          <div className="bg-card rounded-xl shadow-card border border-border">
            <div className="p-5 border-b border-border flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">વધારાના સભ્યો યાદી</h2>
              <Button variant="outline" size="sm" onClick={exportSubMembersCSV} className="gap-1.5">
                <Download className="w-4 h-4" /> Excel/CSV
              </Button>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-foreground font-semibold">#</TableHead>
                    <TableHead className="text-foreground font-semibold">મુખ્ય સભ્ય</TableHead>
                    <TableHead className="text-foreground font-semibold">નામ</TableHead>
                    <TableHead className="text-foreground font-semibold">સંપર્ક</TableHead>
                    <TableHead className="text-foreground font-semibold">વિસ્તાર</TableHead>
                    <TableHead className="text-foreground font-semibold">વ્યવસાય</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(() => {
                    let count = 0;
                    return registrations.flatMap((r) =>
                      (r.subMembers || []).map((s) => {
                        count++;
                        return (
                          <TableRow key={`${r.id}-${count}`} className="hover:bg-primary/5 transition-colors">
                            <TableCell className="text-muted-foreground">{count}</TableCell>
                            <TableCell className="font-medium">{r.fullName}</TableCell>
                            <TableCell>{s.name}</TableCell>
                            <TableCell>{s.contact || "—"}</TableCell>
                            <TableCell>{s.area || "—"}</TableCell>
                            <TableCell>{s.profession || "—"}</TableCell>
                          </TableRow>
                        );
                      })
                    );
                  })()}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {/* Sub Members Dialog */}
        <Dialog open={!!showSubMembers} onOpenChange={(open) => !open && setShowSubMembers(null)}>
          <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{showSubMembers?.fullName} - વધારાના સભ્યો</DialogTitle>
            </DialogHeader>
            {showSubMembers?.subMembers && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>નામ</TableHead>
                    <TableHead>સંપર્ક</TableHead>
                    <TableHead>વિસ્તાર</TableHead>
                    <TableHead>વ્યવસાય</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {showSubMembers.subMembers.map((s, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{s.name}</TableCell>
                      <TableCell>{s.contact || "—"}</TableCell>
                      <TableCell>{s.area || "—"}</TableCell>
                      <TableCell>{s.profession || "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default AdminDashboard;
