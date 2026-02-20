import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppHeader from "@/components/AppHeader";
import { getRegistrations, deleteRegistration, type MemberRegistration } from "@/lib/data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Search, Trash2, Eye, Users, Download } from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState<MemberRegistration[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<MemberRegistration | null>(null);

  useEffect(() => {
    setRegistrations(getRegistrations());
  }, []);

  const filtered = registrations.filter((r) =>
    `${r.fullName} ${r.fatherName} ${r.surname} ${r.mobile} ${r.city}`.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => {
    deleteRegistration(id);
    setRegistrations(getRegistrations());
    toast.success("રેકોર્ડ કાઢી નાખ્યો");
  };

  const exportCSV = () => {
    if (registrations.length === 0) {
      toast.error("એક્સપોર્ટ કરવા માટે કોઈ ડેટા નથી");
      return;
    }
    const headers = [
      "પૂરું નામ", "ફાધર નામ", "સરનેમ", "જન્મ તારીખ", "બ્લડ ગ્રુપ",
      "વૈવાહિક સ્થિતિ", "વ્યવસાય", "મોબાઈલ", "વોટ્સએપ", "એડ્રેસ",
      "શહેર", "પિન કોડ", "અંબરીશ", "સભ્ય પ્રકાર", "શ્રેણી",
      "પૂજા રેગ્યુલર", "સભા રેગ્યુલર", "દશમો/વિસામો", "નોંધણી તારીખ"
    ];
    const rows = registrations.map((r) => [
      r.fullName, r.fatherName, r.surname, r.birthDate, r.bloodGroup,
      r.maritalStatus, r.occupation, r.mobile, r.whatsapp, r.address,
      r.city, r.pinCode, r.isAmbarish, r.memberType, r.category,
      r.pujaRegular, r.sabhaRegular, r.dashmoVisamo, r.registeredAt,
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
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
              <Users className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {registrations.filter((r) => r.isAmbarish === "હા").length}
              </p>
              <p className="text-sm text-muted-foreground">અંબરીશ</p>
            </div>
          </div>
          <div className="bg-card rounded-xl shadow-card border border-border p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
              <Users className="w-6 h-6 text-accent-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {registrations.filter((r) => r.memberType === "નવા").length}
              </p>
              <p className="text-sm text-muted-foreground">નવા સભ્યો</p>
            </div>
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-card rounded-xl shadow-card border border-border">
          <div className="p-5 border-b border-border flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">સભ્ય યાદી</h2>
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="શોધો..."
                  className="pl-9 w-full sm:w-64"
                />
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
                    <TableHead className="text-foreground font-semibold">શહેર</TableHead>
                    <TableHead className="text-foreground font-semibold">શ્રેણી</TableHead>
                    <TableHead className="text-foreground font-semibold text-right">ક્રિયાઓ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((r, i) => (
                    <TableRow key={r.id} className="hover:bg-saffron-light/40 transition-colors">
                      <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                      <TableCell className="font-medium">{r.fullName}</TableCell>
                      <TableCell>{r.surname}</TableCell>
                      <TableCell>{r.mobile}</TableCell>
                      <TableCell>{r.city || "—"}</TableCell>
                      <TableCell>{r.category}</TableCell>
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
                                  <DetailRow label="બ્લડ ગ્રુપ" value={selected.bloodGroup} />
                                  <DetailRow label="વૈવાહિક સ્થિતિ" value={selected.maritalStatus} />
                                  <DetailRow label="વ્યવસાય" value={selected.occupation} />
                                  <DetailRow label="મોબાઈલ" value={selected.mobile} />
                                  <DetailRow label="વોટ્સએપ" value={selected.whatsapp} />
                                  <DetailRow label="એડ્રેસ" value={selected.address} />
                                  <DetailRow label="શહેર" value={selected.city} />
                                  <DetailRow label="પિન કોડ" value={selected.pinCode} />
                                  <DetailRow label="અંબરીશ" value={selected.isAmbarish} />
                                  <DetailRow label="સભ્ય પ્રકાર" value={selected.memberType} />
                                  <DetailRow label="શ્રેણી" value={selected.category} />
                                  <DetailRow label="પૂજા રેગ્યુલર" value={selected.pujaRegular} />
                                  <DetailRow label="સભા રેગ્યુલર" value={selected.sabhaRegular} />
                                  <DetailRow label="દશમો/વિસામો" value={selected.dashmoVisamo} />
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(r.id)}>
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
      </main>
    </div>
  );
};

export default AdminDashboard;
