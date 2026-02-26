import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import AppHeader from "@/components/AppHeader";
import { useAuth } from "@/contexts/AuthContext";
import {
  CITY_OPTIONS,
  getRegistrationByUserId,
  saveRegistrationForUser,
  getUserRegistrationProfile,
  saveUserRegistrationProfile,
  type MemberRegistration,
  type SubMember,
} from "@/lib/data";
import { User, Phone, MapPin, Heart, UserPlus, Trash2, Plus } from "lucide-react";

const emptySubMember = (): SubMember => ({ name: "", contact: "", area: "", profession: "" });

const getUserDraftKey = (uid: string) => `registration_draft_${uid}`;

const RegistrationForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [loadingExisting, setLoadingExisting] = useState(true);
  const [form, setForm] = useState({
    fullName: "",
    fatherName: "",
    surname: "",
    birthDate: "",
    maritalStatus: "",
    occupation: "",
    mobile: "",
    whatsapp: "",
    area: "",
  });

  const [subMembers, setSubMembers] = useState<SubMember[]>([]);

  const applyRegistrationToForm = (existing: MemberRegistration) => {
    setForm({
      fullName: existing.fullName || "",
      fatherName: existing.fatherName || "",
      surname: existing.surname || "",
      birthDate: existing.birthDate || "",
      maritalStatus: existing.maritalStatus || "",
      occupation: existing.occupation || "",
      mobile: existing.mobile || "",
      whatsapp: existing.whatsapp || "",
      area: existing.area || "",
    });
    setSubMembers(existing.subMembers || []);
  };

  useEffect(() => {
    const loadExistingData = async () => {
      if (!user?.uid) {
        setLoadingExisting(false);
        return;
      }

      try {
        const profileRegistration = await getUserRegistrationProfile(user.uid);
        if (profileRegistration) {
          applyRegistrationToForm(profileRegistration);
          localStorage.setItem(getUserDraftKey(user.uid), JSON.stringify(profileRegistration));
          return;
        }

        const existing = await getRegistrationByUserId(user.uid);
        if (existing) {
          applyRegistrationToForm(existing);
          localStorage.setItem(getUserDraftKey(user.uid), JSON.stringify(existing));
          return;
        }

        const rawDraft = localStorage.getItem(getUserDraftKey(user.uid));
        if (rawDraft) {
          const draft = JSON.parse(rawDraft) as MemberRegistration;
          applyRegistrationToForm(draft);
        }
      } catch {
        toast.error("તમારો પહેલાનો ડેટા લોડ કરવામાં મુશ્કેલી આવી");
      } finally {
        setLoadingExisting(false);
      }
    };

    void loadExistingData();
  }, [user?.uid]);

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const addSubMember = () => {
    if (subMembers.length >= 25) {
      toast.error("મહત્તમ 25 સભ્યો ઉમેરી શકાય છે");
      return;
    }
    setSubMembers((prev) => [...prev, emptySubMember()]);
  };

  const removeSubMember = (index: number) => {
    setSubMembers((prev) => prev.filter((_, i) => i !== index));
  };

  const updateSubMember = (index: number, field: keyof SubMember, value: string) => {
    setSubMembers((prev) =>
      prev.map((m, i) => (i === index ? { ...m, [field]: value } : m))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    if (!user?.uid) {
      toast.error("કૃપા કરીને ફરીથી લોગિન કરો");
      return;
    }

    const required = [
      "fullName", "fatherName", "surname", "birthDate",
      "maritalStatus", "occupation", "mobile",
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

    // Validate sub-members have at least name
    const validSubMembers = subMembers.filter((m) => m.name.trim());

    const reg: Omit<MemberRegistration, "id"> = {
      ...form,
      registeredAt: new Date().toISOString(),
      subMembers: validSubMembers.length > 0 ? validSubMembers : undefined,
    };

    setSubmitting(true);
    try {
      const existing = await getRegistrationByUserId(user.uid);
      const payload = {
        ...reg,
        userId: user.uid,
        registeredAt: existing?.registeredAt || reg.registeredAt,
      };

      await saveRegistrationForUser(user.uid, payload);
      await saveUserRegistrationProfile(user.uid, payload);
      localStorage.setItem(
        getUserDraftKey(user.uid),
        JSON.stringify({
          ...payload,
          id: user.uid,
          userId: user.uid,
        }),
      );
      toast.success("નોંધણી સફળતાપૂર્વક થઈ! 🙏");
    } catch {
      toast.error("નોંધણી સેવ કરવામાં મુશ્કેલી આવી, કૃપા કરીને ફરી પ્રયાસ કરો");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingExisting) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">ડેટા લોડ થઈ રહ્યું છે...</p>
        </div>
      </div>
    );
  }

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
    name, value, label,
  }: {
    name: string; value: string; label: string; currentValue?: string; onChange?: (v: string) => void;
  }) => (
    <div className="flex items-center space-x-2">
      <RadioGroupItem value={value} id={`${name}-${value}`} />
      <Label htmlFor={`${name}-${value}`} className="cursor-pointer text-sm">{label}</Label>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
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
            </div>

            <div className="space-y-1.5">
              <RequiredLabel>વૈવાહિક સ્થિતિ</RequiredLabel>
              <RadioGroup value={form.maritalStatus} onValueChange={(v) => updateField("maritalStatus", v)} className="flex gap-6">
                <RadioOption name="marital" value="પરિણીત" label="પરિણીત" />
                <RadioOption name="marital" value="એકલ" label="એકલ" />
              </RadioGroup>
            </div>

            <div className="space-y-1.5">
              <RequiredLabel>વ્યવસાય</RequiredLabel>
              <RadioGroup value={form.occupation} onValueChange={(v) => updateField("occupation", v)} className="flex flex-wrap gap-4">
                {["ખેતી", "નોકરી", "વ્યવસાય", "અભ્યાસ"].map((opt) => (
                  <RadioOption key={opt} name="occupation" value={opt} label={opt} />
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
              <Label className="text-sm font-medium">વિસ્તાર</Label>
              <Select value={form.area} onValueChange={(v) => updateField("area", v)}>
                <SelectTrigger><SelectValue placeholder="વિસ્તાર પસંદ કરો" /></SelectTrigger>
                <SelectContent>
                  {CITY_OPTIONS.map((area) => (
                    <SelectItem key={area} value={area}>{area}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sub Members */}
            <SectionTitle icon={UserPlus} title="વધારાના સભ્યો (મહત્તમ 25)" />

            <div className="space-y-3">
              {subMembers.map((member, index) => (
                <div key={index} className="bg-muted/50 rounded-lg p-4 border border-border relative">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-foreground">સભ્ય #{index + 1}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:text-destructive"
                      onClick={() => removeSubMember(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input
                      value={member.name}
                      onChange={(e) => updateSubMember(index, "name", e.target.value)}
                      placeholder="નામ *"
                      maxLength={100}
                    />
                    <Input
                      value={member.contact}
                      onChange={(e) => updateSubMember(index, "contact", e.target.value.replace(/\D/g, "").slice(0, 10))}
                      placeholder="સંપર્ક નંબર"
                    />
                    <Input
                      value={member.area}
                      onChange={(e) => updateSubMember(index, "area", e.target.value)}
                      placeholder="વિસ્તાર"
                      maxLength={100}
                    />
                    <Input
                      value={member.profession}
                      onChange={(e) => updateSubMember(index, "profession", e.target.value)}
                      placeholder="વ્યવસાય"
                      maxLength={100}
                    />
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={addSubMember}
                className="w-full border-dashed border-2 border-primary/30 text-primary hover:bg-primary/5 gap-2"
                disabled={subMembers.length >= 25}
              >
                <Plus className="w-4 h-4" />
                સભ્ય ઉમેરો ({subMembers.length}/25)
              </Button>
            </div>

            <div className="pt-6">
              <Button type="submit" disabled={submitting} className="w-full gradient-saffron text-primary-foreground hover:opacity-90 transition-opacity h-12 text-lg font-semibold rounded-xl shadow-warm">
                {submitting ? "સેવ થઈ રહ્યું છે..." : "સબમિટ કરો 🙏"}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default RegistrationForm;
