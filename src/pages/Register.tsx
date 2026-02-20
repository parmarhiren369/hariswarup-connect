import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import AppHeader from "@/components/AppHeader";
import {
  CITY_OPTIONS,
  BLOOD_GROUPS,
  saveRegistration,
  type MemberRegistration,
} from "@/lib/data";
import { User, Phone, MapPin, Heart, BookOpen } from "lucide-react";

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    fatherName: "",
    surname: "",
    birthDate: "",
    bloodGroup: "",
    maritalStatus: "",
    occupation: "",
    mobile: "",
    whatsapp: "",
    address: "",
    city: "",
    pinCode: "",
    isAmbarish: "",
    memberType: "",
    category: "",
    pujaRegular: "",
    sabhaRegular: "",
    dashmoVisamo: "",
  });

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const required = [
      "fullName", "fatherName", "surname", "birthDate", "bloodGroup",
      "maritalStatus", "occupation", "mobile", "isAmbarish",
      "memberType", "category", "pujaRegular", "sabhaRegular", "dashmoVisamo",
    ];
    for (const field of required) {
      if (!form[field as keyof typeof form]) {
        toast.error("કૃપા કરીને બધા ફરજિયાત ફીલ્ડ ભરો");
        return;
      }
    }

    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(form.mobile)) {
      toast.error("કૃપા કરીને માન્ય 10 અંકનો મોબાઈલ નંબર દાખલ કરો");
      return;
    }

    const reg: MemberRegistration = {
      ...form,
      id: crypto.randomUUID(),
      registeredAt: new Date().toISOString(),
    };

    saveRegistration(reg);
    toast.success("નોંધણી સફળતાપૂર્વક થઈ! 🙏");
    setForm({
      fullName: "", fatherName: "", surname: "", birthDate: "", bloodGroup: "",
      maritalStatus: "", occupation: "", mobile: "", whatsapp: "", address: "",
      city: "", pinCode: "", isAmbarish: "", memberType: "", category: "",
      pujaRegular: "", sabhaRegular: "", dashmoVisamo: "",
    });
  };

  const SectionTitle = ({ icon: Icon, title }: { icon: React.ElementType; title: string }) => (
    <div className="flex items-center gap-2 mb-4 mt-6 first:mt-0">
      <div className="w-8 h-8 rounded-lg gradient-saffron flex items-center justify-center">
        <Icon className="w-4 h-4 text-primary-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <div className="flex-1 h-px bg-border ml-2" />
    </div>
  );

  const RequiredLabel = ({ children }: { children: React.ReactNode }) => (
    <Label className="text-sm font-medium text-foreground">
      {children} <span className="text-destructive">*</span>
    </Label>
  );

  const RadioOption = ({
    name, value, label, currentValue, onChange,
  }: {
    name: string; value: string; label: string; currentValue: string; onChange: (v: string) => void;
  }) => (
    <div className="flex items-center space-x-2">
      <RadioGroupItem value={value} id={`${name}-${value}`} />
      <Label htmlFor={`${name}-${value}`} className="cursor-pointer text-sm">{label}</Label>
    </div>
  );

  return (
    <div className="min-h-screen gradient-warm">
      <AppHeader subtitle="સભ્ય નોંધણી" showBack onBack={() => navigate("/")} />

      <main className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
        <div className="bg-card rounded-xl shadow-card border border-border p-6 md:p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-foreground">સભ્ય નોંધણી ફોર્મ</h2>
            <p className="text-muted-foreground text-sm mt-1">કૃપા કરીને નીચેની માહિતી ભરો</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Personal Info */}
            <SectionTitle icon={User} title="વ્યક્તિગત માહિતી" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <RequiredLabel>પૂરું નામ</RequiredLabel>
                <Input value={form.fullName} onChange={(e) => updateField("fullName", e.target.value)} placeholder="પૂરું નામ દાખલ કરો" maxLength={100} />
              </div>
              <div className="space-y-1.5">
                <RequiredLabel>ફાધર નામ</RequiredLabel>
                <Input value={form.fatherName} onChange={(e) => updateField("fatherName", e.target.value)} placeholder="ફાધર નામ દાખલ કરો" maxLength={100} />
              </div>
              <div className="space-y-1.5">
                <RequiredLabel>સરનેમ</RequiredLabel>
                <Input value={form.surname} onChange={(e) => updateField("surname", e.target.value)} placeholder="સરનેમ દાખલ કરો" maxLength={100} />
              </div>
              <div className="space-y-1.5">
                <RequiredLabel>જન્મ તારીખ</RequiredLabel>
                <Input type="date" value={form.birthDate} onChange={(e) => updateField("birthDate", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <RequiredLabel>બ્લડ ગ્રુપ</RequiredLabel>
                <Select value={form.bloodGroup} onValueChange={(v) => updateField("bloodGroup", v)}>
                  <SelectTrigger><SelectValue placeholder="બ્લડ ગ્રુપ પસંદ કરો" /></SelectTrigger>
                  <SelectContent>
                    {BLOOD_GROUPS.map((bg) => (
                      <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <RequiredLabel>વૈવાહિક સ્થિતિ</RequiredLabel>
              <RadioGroup value={form.maritalStatus} onValueChange={(v) => updateField("maritalStatus", v)} className="flex gap-6">
                <RadioOption name="marital" value="પરિણીત" label="પરિણીત" currentValue={form.maritalStatus} onChange={(v) => updateField("maritalStatus", v)} />
                <RadioOption name="marital" value="એકલ" label="એકલ" currentValue={form.maritalStatus} onChange={(v) => updateField("maritalStatus", v)} />
              </RadioGroup>
            </div>

            <div className="space-y-1.5">
              <RequiredLabel>વ્યવસાય</RequiredLabel>
              <RadioGroup value={form.occupation} onValueChange={(v) => updateField("occupation", v)} className="flex flex-wrap gap-4">
                {["ખેતી", "નોકરી", "વ્યવસાય", "અભ્યાસ"].map((opt) => (
                  <RadioOption key={opt} name="occupation" value={opt} label={opt} currentValue={form.occupation} onChange={(v) => updateField("occupation", v)} />
                ))}
              </RadioGroup>
            </div>

            {/* Contact Info */}
            <SectionTitle icon={Phone} title="સંપર્ક માહિતી" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <RequiredLabel>મોબાઈલ</RequiredLabel>
                <Input value={form.mobile} onChange={(e) => updateField("mobile", e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="10 અંકનો મોબાઈલ નંબર" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">વોટ્સએપ</Label>
                <Input value={form.whatsapp} onChange={(e) => updateField("whatsapp", e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="વોટ્સએપ નંબર" />
              </div>
            </div>

            {/* Address */}
            <SectionTitle icon={MapPin} title="સરનામું" />

            <div className="space-y-1.5">
              <Label className="text-sm font-medium">એડ્રેસ</Label>
              <Textarea value={form.address} onChange={(e) => updateField("address", e.target.value)} placeholder="સરનામું દાખલ કરો" rows={2} maxLength={500} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">શહેર</Label>
                <Select value={form.city} onValueChange={(v) => updateField("city", v)}>
                  <SelectTrigger><SelectValue placeholder="શહેર પસંદ કરો" /></SelectTrigger>
                  <SelectContent>
                    {CITY_OPTIONS.map((city) => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">પિન કોડ</Label>
                <Input value={form.pinCode} onChange={(e) => updateField("pinCode", e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="પિન કોડ" />
              </div>
            </div>

            {/* Membership */}
            <SectionTitle icon={Heart} title="સભ્યતા વિગતો" />

            <div className="space-y-4">
              <div className="space-y-1.5">
                <RequiredLabel>અંબરીશ છો?</RequiredLabel>
                <RadioGroup value={form.isAmbarish} onValueChange={(v) => updateField("isAmbarish", v)} className="flex gap-6">
                  <RadioOption name="ambarish" value="હા" label="હા" currentValue={form.isAmbarish} onChange={(v) => updateField("isAmbarish", v)} />
                  <RadioOption name="ambarish" value="ના" label="ના" currentValue={form.isAmbarish} onChange={(v) => updateField("isAmbarish", v)} />
                </RadioGroup>
              </div>

              <div className="space-y-1.5">
                <RequiredLabel>સભ્ય પ્રકાર</RequiredLabel>
                <RadioGroup value={form.memberType} onValueChange={(v) => updateField("memberType", v)} className="flex gap-6">
                  <RadioOption name="memberType" value="નવા" label="નવા" currentValue={form.memberType} onChange={(v) => updateField("memberType", v)} />
                  <RadioOption name="memberType" value="જૂના" label="જૂના" currentValue={form.memberType} onChange={(v) => updateField("memberType", v)} />
                </RadioGroup>
              </div>

              <div className="space-y-1.5">
                <RequiredLabel>શ્રેણી</RequiredLabel>
                <RadioGroup value={form.category} onValueChange={(v) => updateField("category", v)} className="flex gap-6">
                  <RadioOption name="category" value="કાર્યકર્તા" label="કાર્યકર્તા" currentValue={form.category} onChange={(v) => updateField("category", v)} />
                  <RadioOption name="category" value="યુવક" label="યુવક" currentValue={form.category} onChange={(v) => updateField("category", v)} />
                </RadioGroup>
              </div>
            </div>

            {/* Regularity */}
            <SectionTitle icon={BookOpen} title="નિયમિતતા" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <RequiredLabel>પૂજા રેગ્યુલર?</RequiredLabel>
                <RadioGroup value={form.pujaRegular} onValueChange={(v) => updateField("pujaRegular", v)} className="flex gap-4">
                  <RadioOption name="puja" value="હા" label="હા" currentValue={form.pujaRegular} onChange={(v) => updateField("pujaRegular", v)} />
                  <RadioOption name="puja" value="ના" label="ના" currentValue={form.pujaRegular} onChange={(v) => updateField("pujaRegular", v)} />
                </RadioGroup>
              </div>
              <div className="space-y-1.5">
                <RequiredLabel>સભા રેગ્યુલર?</RequiredLabel>
                <RadioGroup value={form.sabhaRegular} onValueChange={(v) => updateField("sabhaRegular", v)} className="flex gap-4">
                  <RadioOption name="sabha" value="હા" label="હા" currentValue={form.sabhaRegular} onChange={(v) => updateField("sabhaRegular", v)} />
                  <RadioOption name="sabha" value="ના" label="ના" currentValue={form.sabhaRegular} onChange={(v) => updateField("sabhaRegular", v)} />
                </RadioGroup>
              </div>
              <div className="space-y-1.5">
                <RequiredLabel>દશમો/વિસામો?</RequiredLabel>
                <RadioGroup value={form.dashmoVisamo} onValueChange={(v) => updateField("dashmoVisamo", v)} className="flex gap-4">
                  <RadioOption name="dashmo" value="હા" label="હા" currentValue={form.dashmoVisamo} onChange={(v) => updateField("dashmoVisamo", v)} />
                  <RadioOption name="dashmo" value="ના" label="ના" currentValue={form.dashmoVisamo} onChange={(v) => updateField("dashmoVisamo", v)} />
                </RadioGroup>
              </div>
            </div>

            <div className="pt-6">
              <Button type="submit" className="w-full gradient-saffron text-primary-foreground hover:opacity-90 transition-opacity h-12 text-lg font-semibold rounded-xl shadow-warm">
                સબમિટ કરો 🙏
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default RegistrationForm;
