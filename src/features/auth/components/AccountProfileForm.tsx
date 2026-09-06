"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { GraduationCap, Home, MapPin, Phone, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { AL_STREAMS, DISTRICTS } from "@/lib/constants";
import { isNormalizedApiError } from "@/lib/api";
import { useUpdateProfileMutation } from "../authApi";
import type { User as AuthUser } from "../authTypes";

const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().regex(/^0\d{9}$/, "Invalid Sri Lankan phone number format (e.g., 0757451258)"),
  address: z.string().min(1, "Address is required"),
  district: z.enum(DISTRICTS, { message: "Please select a district" }),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  alStream: z.enum(AL_STREAMS, { message: "Please select an A/L stream" }),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const fieldIconClassName = "absolute left-3 top-3.5 h-4 w-4 text-muted-foreground pointer-events-none";
const inputClassName = "h-11 rounded-xl border-input bg-muted/50 pl-10";

/** Edits the current user's own profile fields (name, contact, personal details). */
export default function AccountProfileForm({ user }: { user: AuthUser }) {
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isDirty },
    setError,
    reset,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone ?? "",
      address: user.address ?? "",
      district: (user.district ?? undefined) as ProfileFormValues["district"],
      dateOfBirth: user.dateOfBirth ? user.dateOfBirth.slice(0, 10) : "",
      alStream: (user.alStream ?? undefined) as ProfileFormValues["alStream"],
    },
  });

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      const updated = await updateProfile(values).unwrap();
      toast.success("Profile updated successfully");
      reset({
        firstName: updated.firstName,
        lastName: updated.lastName,
        phone: updated.phone ?? "",
        address: updated.address ?? "",
        district: (updated.district ?? undefined) as ProfileFormValues["district"],
        dateOfBirth: updated.dateOfBirth ? updated.dateOfBirth.slice(0, 10) : "",
        alStream: (updated.alStream ?? undefined) as ProfileFormValues["alStream"],
      });
    } catch (error: unknown) {
      if (isNormalizedApiError(error) && error.field) {
        setError(error.field as keyof ProfileFormValues, { type: "server", message: error.message });
      } else {
        toast.error(isNormalizedApiError(error) ? error.message : "Could not update your profile");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="firstName">First name</Label>
          <div className="relative">
            <User className={fieldIconClassName} />
            <Input id="firstName" className={inputClassName} error={!!errors.firstName} disabled={isLoading} {...register("firstName")} />
          </div>
          {errors.firstName ? <p className="text-xs font-medium text-destructive">{errors.firstName.message}</p> : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last name</Label>
          <div className="relative">
            <User className={fieldIconClassName} />
            <Input id="lastName" className={inputClassName} error={!!errors.lastName} disabled={isLoading} {...register("lastName")} />
          </div>
          {errors.lastName ? <p className="text-xs font-medium text-destructive">{errors.lastName.message}</p> : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone number</Label>
          <div className="relative">
            <Phone className={fieldIconClassName} />
            <Input id="phone" className={inputClassName} error={!!errors.phone} disabled={isLoading} {...register("phone")} />
          </div>
          {errors.phone ? <p className="text-xs font-medium text-destructive">{errors.phone.message}</p> : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date of birth</Label>
          <Controller
            name="dateOfBirth"
            control={control}
            render={({ field }) => (
              <DatePicker id="dateOfBirth" value={field.value} onChange={field.onChange} onBlur={field.onBlur} error={!!errors.dateOfBirth} disabled={isLoading} />
            )}
          />
          {errors.dateOfBirth ? <p className="text-xs font-medium text-destructive">{errors.dateOfBirth.message}</p> : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="district">District</Label>
          <Controller
            name="district"
            control={control}
            render={({ field }) => (
              <Select id="district" value={field.value} onChange={field.onChange} onBlur={field.onBlur} options={DISTRICTS} placeholder="Select district" icon={MapPin} error={!!errors.district} disabled={isLoading} />
            )}
          />
          {errors.district ? <p className="text-xs font-medium text-destructive">{errors.district.message}</p> : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="alStream">A/L stream</Label>
          <Controller
            name="alStream"
            control={control}
            render={({ field }) => (
              <Select id="alStream" value={field.value} onChange={field.onChange} onBlur={field.onBlur} options={AL_STREAMS} placeholder="Select A/L stream" icon={GraduationCap} error={!!errors.alStream} disabled={isLoading} />
            )}
          />
          {errors.alStream ? <p className="text-xs font-medium text-destructive">{errors.alStream.message}</p> : null}
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="address">Address</Label>
          <div className="relative">
            <Home className={fieldIconClassName} />
            <Input id="address" className={inputClassName} error={!!errors.address} disabled={isLoading} {...register("address")} />
          </div>
          {errors.address ? <p className="text-xs font-medium text-destructive">{errors.address.message}</p> : null}
        </div>
      </div>

      <Button type="submit" disabled={isLoading || !isDirty}>
        {isLoading ? "Saving…" : "Save changes"}
      </Button>
    </form>
  );
}
