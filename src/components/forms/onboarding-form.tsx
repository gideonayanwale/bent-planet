"use client";

import { useState } from "react";
import {
  Building2Icon,
  GlobeIcon,
  LockIcon,
  SparklesIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  CheckCircle2Icon,
  UploadIcon,
  EyeIcon,
  EyeOffIcon,
} from "lucide-react";

import { useRouter } from "next/navigation";

import { completeOnboardingAction } from "@/app/onboarding/[token]/actions";
import { FieldError } from "@/components/forms/field-error";
import { FormFeedback } from "@/components/forms/form-feedback";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { INITIAL_ACTION_STATE, type ActionState } from "@/lib/forms";

type OnboardingFormProps = {
  adminEmail: string;
  token: string;
  defaultValues: {
    churchName: string;
    adminName: string;
    country: string;
    timezone: string;
    bio: string;
    instagramUrl: string;
    facebookUrl: string;
    youtubeUrl: string;
    whatsappUrl: string;
  };
};

export function OnboardingForm({ adminEmail, token, defaultValues }: OnboardingFormProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [state, setState] = useState<ActionState>(INITIAL_ACTION_STATE);
  const [isPending, setIsPending] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // Form values state for step validation
  const [churchName, setChurchName] = useState(defaultValues.churchName);
  const [adminName, setAdminName] = useState(defaultValues.adminName);
  const [country, setCountry] = useState(defaultValues.country || "United States");
  const [timezone, setTimezone] = useState(defaultValues.timezone || "America/New_York");
  const [bio, setBio] = useState(defaultValues.bio);

  const steps = [
    { id: 1, name: "Identity", icon: Building2Icon, desc: "Church details & logo" },
    { id: 2, name: "Reach", icon: GlobeIcon, desc: "Social & community" },
    { id: 3, name: "Security", icon: LockIcon, desc: "Admin credentials" },
  ];

  // Password strength calculation
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: "Empty", color: "bg-slate-200" };
    if (pwd.length < 8) return { score: 1, label: "Too short", color: "bg-rose-500" };
    const hasLetters = /[a-zA-Z]/.test(pwd);
    const hasNumbers = /[0-9]/.test(pwd);
    const hasSpecial = /[^a-zA-Z0-9]/.test(pwd);

    if (hasLetters && hasNumbers && hasSpecial && pwd.length >= 10) {
      return { score: 3, label: "Strong & Secure", color: "bg-emerald-500" };
    }
    if (hasLetters && hasNumbers) {
      return { score: 2, label: "Moderate", color: "bg-amber-500" };
    }
    return { score: 1, label: "Weak", color: "bg-rose-500" };
  };

  const strength = getPasswordStrength(password);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLogoPreview(url);
    }
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  async function formAction(formData: FormData) {
    setIsPending(true);
    setState(INITIAL_ACTION_STATE);

    const nextState = await completeOnboardingAction(formData);

    if (nextState?.payload) {
      router.push(nextState.payload);
      return;
    }

    if (nextState) {
      setState(nextState);
    }

    setIsPending(false);
  }

  return (
    <div className="space-y-8">
      {/* Wizard Progress Indicator */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
          <span>Step {currentStep} of 3: {steps[currentStep - 1].desc}</span>
          <span>{Math.round((currentStep / 3) * 100)}% Completed</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-300 ease-out"
            style={{ width: `${(currentStep / 3) * 100}%` }}
          />
        </div>

        {/* Step Buttons */}
        <div className="grid grid-cols-3 gap-2 pt-2">
          {steps.map((step) => {
            const Icon = step.icon;
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => isCompleted && setCurrentStep(step.id)}
                disabled={!isCompleted && !isCurrent}
                className={`flex items-center gap-2 rounded-xl p-3 text-left transition-all ${
                  isCurrent
                    ? "bg-indigo-50/80 border-2 border-indigo-600 text-indigo-900 shadow-xs"
                    : isCompleted
                    ? "bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer"
                    : "bg-slate-50/50 border border-slate-100 text-slate-400 opacity-60 cursor-not-allowed"
                }`}
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                    isCurrent
                      ? "bg-indigo-600 text-white"
                      : isCompleted
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {isCompleted ? <CheckCircle2Icon className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                </div>
                <div className="hidden sm:block">
                  <div className="text-xs font-bold leading-none">{step.name}</div>
                  <div className="text-[10px] text-slate-500 leading-tight mt-0.5">{step.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <form action={formAction} className="space-y-6" encType="multipart/form-data">
        <input type="hidden" name="token" value={token} />

        {/* STEP 1: IDENTITY */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in-50 duration-200">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="churchName">Church name *</Label>
                <Input
                  id="churchName"
                  name="churchName"
                  value={churchName}
                  onChange={(e) => setChurchName(e.target.value)}
                  placeholder="e.g. Grace Fellowship Church"
                  required
                />
                <FieldError errors={state.fieldErrors?.churchName} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="adminName">Admin full name *</Label>
                <Input
                  id="adminName"
                  name="adminName"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  placeholder="e.g. Pastor David John"
                  required
                />
                <FieldError errors={state.fieldErrors?.adminName} />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Input
                  id="country"
                  name="country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                />
                <FieldError errors={state.fieldErrors?.country} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone *</Label>
                <Input
                  id="timezone"
                  name="timezone"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  required
                />
                <FieldError errors={state.fieldErrors?.timezone} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Church bio / statement *</Label>
              <Textarea
                id="bio"
                name="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="A brief description of your ministry's vision and calling..."
                className="min-h-[100px]"
                required
              />
              <FieldError errors={state.fieldErrors?.bio} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="logo">Church logo emblem *</Label>
              <div className="flex items-center gap-4 rounded-xl border border-dashed border-slate-300 p-4 bg-slate-50/50 hover:bg-slate-50 transition">
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo preview" className="h-16 w-16 rounded-xl object-cover border border-slate-200 shadow-xs" />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-slate-200 text-slate-400">
                    <UploadIcon className="h-6 w-6" />
                  </div>
                )}
                <div className="flex-1 space-y-1">
                  <Input
                    id="logo"
                    name="logo"
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/svg+xml"
                    onChange={handleLogoChange}
                    className="cursor-pointer text-xs"
                    required
                  />
                  <p className="text-[11px] text-slate-500">PNG, JPEG, WEBP, or SVG. Recommended size 400x400px.</p>
                </div>
              </div>
              <FieldError errors={state.fieldErrors?.logo} />
            </div>
          </div>
        )}

        {/* STEP 2: REACH & SOCIAL */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in-50 duration-200">
            <div className="rounded-xl bg-indigo-50/60 p-4 border border-indigo-100 text-xs text-indigo-900 leading-relaxed">
              💡 <strong>Connect your channels:</strong> Attendees subscribing to your conferences will be invited to join your official social networks and WhatsApp groups.
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="instagramUrl">Instagram URL</Label>
                <Input
                  id="instagramUrl"
                  name="instagramUrl"
                  type="url"
                  defaultValue={defaultValues.instagramUrl}
                  placeholder="https://instagram.com/yourchurch"
                />
                <FieldError errors={state.fieldErrors?.instagramUrl} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="facebookUrl">Facebook URL</Label>
                <Input
                  id="facebookUrl"
                  name="facebookUrl"
                  type="url"
                  defaultValue={defaultValues.facebookUrl}
                  placeholder="https://facebook.com/yourchurch"
                />
                <FieldError errors={state.fieldErrors?.facebookUrl} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="youtubeUrl">YouTube Live / Channel URL</Label>
                <Input
                  id="youtubeUrl"
                  name="youtubeUrl"
                  type="url"
                  defaultValue={defaultValues.youtubeUrl}
                  placeholder="https://youtube.com/@yourchurch"
                />
                <FieldError errors={state.fieldErrors?.youtubeUrl} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsappUrl">WhatsApp Group / Channel Invite Link</Label>
                <Input
                  id="whatsappUrl"
                  name="whatsappUrl"
                  type="url"
                  defaultValue={defaultValues.whatsappUrl}
                  placeholder="https://chat.whatsapp.com/..."
                />
                <FieldError errors={state.fieldErrors?.whatsappUrl} />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: SECURITY & ADMIN ACCOUNT */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in-50 duration-200">
            <div className="space-y-2">
              <Label>Invited Admin Email</Label>
              <Input value={adminEmail} disabled className="bg-slate-100 font-mono text-sm" />
              <p className="text-[11px] text-slate-500">This email is locked to your invite link.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="password">Create Admin Password *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                  </button>
                </div>
                {password && (
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-[11px] font-medium text-slate-600">
                      <span>Password strength:</span>
                      <span className="font-semibold">{strength.label}</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div className={`h-full ${strength.color} transition-all duration-200`} style={{ width: `${(strength.score / 3) * 100}%` }} />
                    </div>
                  </div>
                )}
                <FieldError errors={state.fieldErrors?.password} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  placeholder="Re-enter password"
                  required
                />
                <FieldError errors={state.fieldErrors?.confirmPassword} />
              </div>
            </div>
          </div>
        )}

        <FormFeedback state={state} />

        {/* Wizard Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          {currentStep > 1 ? (
            <Button type="button" variant="outline" onClick={handlePrevStep} className="gap-2">
              <ArrowLeftIcon className="h-4 w-4" />
              Previous Step
            </Button>
          ) : (
            <div />
          )}

          {currentStep < 3 ? (
            <Button type="button" onClick={handleNextStep} className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white">
              Next: {steps[currentStep].name}
              <ArrowRightIcon className="h-4 w-4" />
            </Button>
          ) : (
            <Button type="submit" size="lg" disabled={isPending} className="gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md hover:opacity-95">
              <SparklesIcon className="h-4 w-4" />
              {isPending ? "Activating Bent Planet Workspace..." : "Complete Setup & Launch Dashboard"}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
