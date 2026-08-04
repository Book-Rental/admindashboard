import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import {
    Checkbox,
    Dropdown,
    Rb_BreadCrumb,
    Rb_Button,
    Rb_Image,
    Rb_Input,
    Rb_Label,
} from "@rentbook/rentbook-ui-lib";

import {
    FaCamera,
    FaCircle,
    FaStickyNote,
    FaTimes,
    FaUpload,
    FaUser,
} from "react-icons/fa";

import {
    AgentDetails,
    AgentFormData,
    VehicleType,
} from "../types/agent";
import { showToast } from "../utils/showToaster";

interface Props {
    hubId: string;
    initialData?: AgentDetails;
    isLoading?: boolean;
    onSubmit: (data: AgentFormData) => void;
    onCancel: () => void;
    title?: string;
    description?: string;
    submitText?: string;
}

const emptyForm: AgentFormData = {
    hubId: "",
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    vehicleType: "",
    vehicleNumber: "",
    address: "",
    emergencyContact: "",
    notes: "",
    photo: null,
    isActive: true,
};

const vehicleOptions = [
    { label: "Bike", value: "Bike" },
    { label: "Scooter", value: "Scooter" },
    { label: "Car", value: "Car" },
];

const controlClass =
    "!h-11 !w-full !rounded-lg !border !border-gray-300 !bg-white !px-3.5 !text-sm !text-gray-900 !shadow-sm !outline-none !transition-colors placeholder:!text-gray-400 hover:!border-gray-400 focus:!border-gray-300 focus:!shadow-sm disabled:!border-gray-200 disabled:!bg-gray-50 disabled:!text-gray-400";

export default function AgentForm({
    hubId,
    initialData,
    isLoading = false,
    onSubmit,
    onCancel,
    title = initialData ? "Edit Agent" : "Add New Agent",
    description = initialData
        ? "Update the agent's information."
        : "Create a delivery agent profile.",
    submitText = initialData ? "Save Changes" : "Create Agent",
}: Props) {
    const {
        register,
        control,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors },
    } = useForm<AgentFormData>({
        defaultValues: emptyForm,
        mode: "onSubmit",
        reValidateMode: "onChange",
    });

    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [displayPhoto, setDisplayPhoto] = useState<string | null>(null);
    const [photoError, setPhotoError] = useState("");

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (!initialData) {
            reset({
                ...emptyForm,
                hubId,
            });

            setPhotoFile(null);
            setDisplayPhoto(null);
            return;
        }


        const selectedHubId =
            typeof initialData.hubId === "string"
                ? initialData.hubId
                : initialData.hubId?._id || hubId;

        const existingPhoto =
            typeof initialData.photo === "string"
                ? initialData.photo
                : null;

        reset({
            hubId: selectedHubId,
            fullName: initialData.fullName || "",
            email: initialData.email || "",
            phoneNumber: initialData.phoneNumber || "",
            password: "",
            vehicleType: initialData.vehicleType || "",
            vehicleNumber: initialData.vehicleNumber || "",
            address: initialData.address || "",
            emergencyContact: initialData.emergencyContact || "",
            notes: initialData.notes || "",
            photo: existingPhoto,
            isActive: initialData.isActive ?? true,
        });

        setPhotoFile(null);
        setDisplayPhoto(existingPhoto);
    }, [initialData, hubId, reset]);

    const fullName = watch("fullName");

    const handlePhoneInput = (
        e: React.FormEvent<HTMLInputElement>,
        field: "phoneNumber" | "emergencyContact"
    ) => {
        const value = e.currentTarget.value
            .replace(/\D/g, "")
            .slice(0, 10);

        e.currentTarget.value = value;

        setValue(field, value, {
            shouldDirty: true,
            shouldValidate: true,
        });
    };

    const handleVehicleInput = (
        e: React.FormEvent<HTMLInputElement>
    ) => {
        const value = e.currentTarget.value
            .toUpperCase()
            .replace(/[^A-Z0-9]/g, "")
            .slice(0, 10);

        e.currentTarget.value = value;

        setValue("vehicleNumber", value, {
            shouldDirty: true,
            shouldValidate: true,
        });
    };

    const handlePhotoChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];

        if (!file) {
            return;
        }

        if (!["image/jpeg", "image/png"].includes(file.type)) {
            setPhotoError("Only JPG and PNG images are allowed.");
            e.target.value = "";
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            setPhotoError("Image size must be less than 2MB.");
            e.target.value = "";
            return;
        }

        if (displayPhoto?.startsWith("blob:")) {
            URL.revokeObjectURL(displayPhoto);
        }

        const preview = URL.createObjectURL(file);

        // File for API
        setPhotoFile(file);

        // Blob URL only for UI preview
        setDisplayPhoto(preview);

        // IMPORTANT: store actual File in react-hook-form
        setValue("photo", file, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true,
        });

        showToast("Photo selected successfully.", "success");
    };

    const removePhoto = () => {
        if (displayPhoto?.startsWith("blob:")) {
            URL.revokeObjectURL(displayPhoto);
        }

        setPhotoFile(null);
        setDisplayPhoto(null);
        setPhotoError("");

        setValue("photo", null, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true,
        });

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        showToast("Photo removed successfully.", "success");

    };

    useEffect(() => {
        return () => {
            if (displayPhoto?.startsWith("blob:")) {
                URL.revokeObjectURL(displayPhoto);
            }
        };
    }, [displayPhoto]);

    return (
        <div className="min-h-screen mx-auto w-full bg-gradient-to-br from-slate-50 via-white to-slate-100 px-3 py-5 sm:px-6 sm:py-8 lg:px-8">

            {/* HEADER */}
            <div className="mb-6 sm:mb-8">
                <div className="mb-4 flex items-center gap-3">
                    <Rb_BreadCrumb
                        items={[
                            {
                                label: "Delivery Agents",
                                path: `/agents?hubId=${hubId}`,
                            },
                            {
                                label: initialData?.fullName || "Agent Details",
                            },
                        ]}
                        onNavigate={(path) => {
                            window.history.pushState({}, "", path);

                            window.dispatchEvent(
                                new PopStateEvent("popstate")
                            );
                        }}
                    />
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
                    <div className="flex items-start gap-3 sm:items-center">

                        <div className="hidden h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 text-xl shadow-sm sm:flex">
                            <FaUser />
                        </div>

                        <div className="min-w-0">
                            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                                {title}
                            </h1>

                            <p className="mt-1 text-sm text-gray-500">
                                {description}
                            </p>
                        </div>
                    </div>

                    <p className="text-xs text-gray-500 sm:flex-shrink-0 sm:text-right">
                        <span className="font-semibold text-red-500">
                            *
                        </span>{" "}
                        Required fields
                    </p>
                </div>
            </div>

            <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                className="agent-form"
            >
                <div className="grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-3">

                    {/* BASIC INFORMATION */}
                    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md lg:col-span-2">

                        <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white px-5 py-4 sm:px-6 sm:py-5">
                            <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-100 text-lg text-blue-600 shadow-sm">
                                    <FaUser />
                                </div>

                                <div className="min-w-0">
                                    <h2 className="text-base font-semibold text-gray-900 sm:text-lg">
                                        Basic Information
                                    </h2>

                                    <p className="mt-0.5 truncate text-xs text-gray-500">
                                        Enter the agent's personal and
                                        contact details.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-5 sm:p-6 lg:p-7">
                            <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 sm:gap-y-6">

                                {/* FULL NAME */}
                                <FormField
                                    label="Full Name"
                                    required
                                    error={errors.fullName?.message}
                                >
                                    <Rb_Input
                                        id="fullName"
                                        placeholder="Enter full name"
                                        className={controlClass}
                                        {...register("fullName", {
                                            required:
                                                "Full name is required.",
                                            minLength: {
                                                value: 2,
                                                message:
                                                    "Full name must be at least 2 characters.",
                                            },
                                            maxLength: {
                                                value: 50,
                                                message:
                                                    "Full name cannot exceed 50 characters.",
                                            },
                                            pattern: {
                                                value: /^[A-Za-z ]+$/,
                                                message:
                                                    "Full name can contain only letters and spaces.",
                                            },
                                        })}
                                    />
                                </FormField>

                                {/* EMAIL */}
                                <FormField
                                    label="Email Address"
                                    required
                                    error={errors.email?.message}
                                >
                                    <Rb_Input
                                        id="email"
                                        type="email"
                                        placeholder="Enter email address"
                                        className={controlClass}
                                        {...register("email", {
                                            required:
                                                "Email address is required.",
                                            pattern: {
                                                value:
                                                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                message:
                                                    "Enter a valid email address.",
                                            },
                                        })}
                                    />
                                </FormField>

                                {/* PASSWORD */}
                                <FormField
                                    label="Password"
                                    required={!initialData}
                                    error={errors.password?.message}
                                >
                                    <Rb_Input
                                        id="password"
                                        type="password"
                                        placeholder={
                                            initialData
                                                ? "Leave blank to keep current password"
                                                : "Enter password"
                                        }
                                        className={controlClass}
                                        {...register("password", {
                                            required: !initialData
                                                ? "Password is required."
                                                : false,
                                            minLength: {
                                                value: 6,
                                                message:
                                                    "Password must be at least 6 characters.",
                                            },
                                            maxLength: {
                                                value: 50,
                                                message:
                                                    "Password cannot exceed 50 characters.",
                                            },
                                        })}
                                    />

                                    {initialData && (
                                        <p className="mt-1 text-xs text-gray-400">
                                            Leave blank if you don't want
                                            to change the password.
                                        </p>
                                    )}
                                </FormField>

                                {/* PHONE */}
                                <FormField
                                    label="Phone Number"
                                    required
                                    error={errors.phoneNumber?.message}
                                >
                                    <Rb_Input
                                        id="phoneNumber"
                                        type="tel"
                                        inputMode="numeric"
                                        maxLength={10}
                                        placeholder="Enter 10-digit phone number"
                                        className={controlClass}
                                        {...register("phoneNumber", {
                                            required:
                                                "Phone number is required.",
                                            validate: (value) =>
                                                /^\d{10}$/.test(value) ||
                                                "Phone number must contain exactly 10 digits.",
                                        })}
                                        onInput={(e) =>
                                            handlePhoneInput(
                                                e,
                                                "phoneNumber"
                                            )
                                        }
                                    />
                                </FormField>

                                {/* VEHICLE TYPE */}
                                <FormField
                                    label="Vehicle Type"
                                    required
                                    error={errors.vehicleType?.message}
                                >
                                    <Controller
                                        name="vehicleType"
                                        control={control}
                                        rules={{
                                            required:
                                                "Vehicle type is required.",
                                        }}
                                        render={({ field }) => (
                                            <div
                                                className="
                                                        [&_.dropdown__select]:!mt-2.5
                                                        [&_.dropdown__select]:!h-11
                                                        [&_.dropdown__select]:!w-full
                                                        [&_.dropdown__select]:!rounded-lg
                                                        [&_.dropdown__select]:!border
                                                        [&_.dropdown__select]:!border-gray-300
                                                        [&_.dropdown__select]:!bg-white
                                                        [&_.dropdown__select]:!px-3.5
                                                        [&_.dropdown__select]:!text-sm
                                                        [&_.dropdown__select]:!text-gray-900
                                                        [&_.dropdown__select]:!outline-none
                                                        [&_.dropdown__select]:!transition-colors
                                                        [&_.dropdown__select:hover]:!border-gray-400
                                                        [&_.dropdown__select:disabled]:!border-gray-200
                                                        [&_.dropdown__select:disabled]:!bg-gray-50
                                                        [&_.dropdown__select:disabled]:!text-gray-400
                                                    "
                                            >
                                                <Dropdown
                                                    label=""
                                                    placeholder="Select vehicle type"
                                                    options={vehicleOptions}
                                                    value={field.value}
                                                    onChange={(value) =>
                                                        field.onChange(
                                                            value as VehicleType
                                                        )
                                                    }
                                                />
                                            </div>
                                        )}
                                    />
                                </FormField>

                                {/* VEHICLE NUMBER */}
                                <FormField
                                    label="Vehicle Number"
                                    error={errors.vehicleNumber?.message}
                                >
                                    <Rb_Input
                                        id="vehicleNumber"
                                        maxLength={10}
                                        placeholder="Example: TS09AB1234"
                                        className={controlClass}
                                        {...register("vehicleNumber", {
                                            validate: (value) =>
                                                !value ||
                                                /^[A-Z]{2}\d{1,2}[A-Z]{1,3}\d{4}$/.test(
                                                    value
                                                ) ||
                                                "Enter a valid vehicle number. Example: TS09AB1234",
                                        })}
                                        onInput={handleVehicleInput}
                                    />
                                </FormField>

                                {/* EMERGENCY CONTACT */}
                                <FormField
                                    label="Emergency Contact"
                                    error={
                                        errors.emergencyContact?.message
                                    }
                                >
                                    <Rb_Input
                                        id="emergencyContact"
                                        type="tel"
                                        inputMode="numeric"
                                        maxLength={10}
                                        placeholder="Enter 10-digit contact"
                                        className={controlClass}
                                        {...register(
                                            "emergencyContact",
                                            {
                                                validate: (value) =>
                                                    !value ||
                                                    /^\d{10}$/.test(
                                                        value
                                                    ) ||
                                                    "Contact must contain exactly 10 digits.",
                                            }
                                        )}
                                        onInput={(e) =>
                                            handlePhoneInput(
                                                e,
                                                "emergencyContact"
                                            )
                                        }
                                    />
                                </FormField>
                            </div>

                            {/* ADDRESS */}
                            <div className="mt-6 border-t border-gray-100 pt-5 sm:mt-7 sm:pt-6">
                                <div className="mb-2 flex items-center justify-between">
                                    <Rb_Label>
                                        Address
                                    </Rb_Label>

                                    <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-500">
                                        Optional
                                    </span>
                                </div>

                                <Rb_Input
                                    id="address"
                                    placeholder="Enter full address"
                                    className={controlClass}
                                    {...register("address", {
                                        maxLength: {
                                            value: 250,
                                            message:
                                                "Address cannot exceed 250 characters.",
                                        },
                                    })}
                                />

                                <ErrorText
                                    message={errors.address?.message}
                                />
                            </div>

                            {/* ACTIVE STATUS */}
                            <div className="mt-5 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 sm:mt-6">
                                <Controller
                                    name="isActive"
                                    control={control}
                                    render={({ field }) => (
                                        <Checkbox
                                            label="Set as Active"
                                            checked={field.value}
                                            onChange={field.onChange}
                                        />
                                    )}
                                />

                                <p className="ml-7 mt-1 text-xs text-gray-500">
                                    Active agents can receive delivery
                                    assignments.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="flex flex-col gap-5 sm:gap-6">

                        {/* PHOTO */}
                        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">

                            <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white px-5 py-4 sm:px-6 sm:py-5">
                                <div className="flex items-center gap-3">

                                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-100 text-lg text-blue-600 shadow-sm">
                                        <FaCamera />
                                    </div>

                                    <div className="min-w-0">
                                        <h2 className="text-base font-semibold text-gray-900 sm:text-lg">
                                            Agent Photo
                                        </h2>

                                        <p className="truncate text-xs text-gray-500">
                                            Upload a clear profile photo.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-5 sm:p-6">
                                {displayPhoto ? (
                                    <div className="flex flex-col items-center">

                                        <div className="relative rounded-full bg-gray-50 p-2 shadow-inner">
                                            <Rb_Image
                                                src={displayPhoto || ""}
                                                alt={fullName || "Agent"}
                                                className="!h-36 !w-36 rounded-full object-cover sm:!h-40 sm:!w-40"
                                            />

                                            <Rb_Button
                                                type="button"
                                                onClick={removePhoto}
                                                aria-label="Remove photo"
                                                className="!absolute !-right-2 !-top-2 !flex !h-8 !w-8 !min-w-0 !items-center !justify-center !rounded-full !border-2 !border-white !bg-red-500 !p-0 !text-white !shadow-md !transition-colors hover:!bg-red-600"
                                            >
                                                <FaTimes className="text-sm" />
                                            </Rb_Button>
                                        </div>

                                        {photoFile && (
                                            <p className="mt-3 max-w-full truncate rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                                                {photoFile.name}
                                            </p>
                                        )}

                                        <Rb_Button
                                            type="button"
                                            onClick={() =>
                                                fileInputRef.current?.click()
                                            }
                                            className="!mt-3 !border-0 !bg-transparent !p-0 !text-xs !font-semibold !text-gray-500 !shadow-none !transition-colors hover:!text-gray-800"
                                        >
                                            Choose a different photo
                                        </Rb_Button>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            fileInputRef.current?.click()
                                        }
                                        className="group flex min-h-[200px] w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/70 px-5 transition-all hover:border-gray-400 hover:bg-gray-50 sm:min-h-[220px]"
                                    >
                                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 shadow-sm transition-transform group-hover:scale-105 sm:h-14 sm:w-14">
                                            <FaUpload className="text-xl" />
                                        </div>

                                        <span className="font-semibold text-gray-700 transition-colors group-hover:text-gray-900">
                                            Upload agent photo
                                        </span>

                                        <p className="mt-2 text-center text-xs text-gray-400">
                                            JPG or PNG up to 2MB
                                        </p>
                                    </button>
                                )}

                                <div className="hidden">
                                    <Rb_Input
                                        ref={fileInputRef}
                                        id="agent-photo"
                                        type="file"
                                        accept="image/jpeg,image/png"
                                        onChange={handlePhotoChange}
                                    />
                                </div>

                                <ErrorText message={photoError} />
                                <ErrorText message={errors.photo?.message} />
                            </div>
                        </div>

                        {/* NOTES */}
                        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">

                            <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white px-5 py-4 sm:px-6 sm:py-5">
                                <div className="flex items-center gap-3">

                                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-100 text-lg text-blue-600 shadow-sm">
                                        <FaStickyNote />
                                    </div>

                                    <div className="min-w-0">
                                        <h2 className="text-base font-semibold text-gray-900 sm:text-lg">
                                            Notes
                                        </h2>

                                        <p className="truncate text-xs text-gray-500">
                                            Add any additional information.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-5 sm:p-6">
                                <div className="mb-2 flex items-center justify-between">
                                    <Rb_Label>
                                        Additional Notes
                                    </Rb_Label>

                                    <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-500">
                                        Optional
                                    </span>
                                </div>

                                <Rb_Input
                                    id="notes"
                                    placeholder="Enter additional notes"
                                    className={controlClass}
                                    {...register("notes", {
                                        maxLength: {
                                            value: 500,
                                            message:
                                                "Notes cannot exceed 500 characters.",
                                        },
                                    })}
                                />

                                <ErrorText
                                    message={errors.notes?.message}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="sticky bottom-0 mt-7 -mx-3 flex flex-col-reverse gap-3 border-t border-gray-200 bg-white/90 px-3 py-4 backdrop-blur sm:static sm:mx-0 sm:flex-row sm:justify-end sm:bg-transparent sm:px-0 sm:py-0 sm:pt-6 sm:backdrop-blur-none">

                    <Rb_Button
                        type="button"
                        variant="secondary"
                        onClick={onCancel}
                        className="!min-w-[110px] !rounded-xl"
                    >
                        Cancel
                    </Rb_Button>

                    <Rb_Button
                        type="submit"
                        isLoading={isLoading}
                        className="!min-w-[150px] !rounded-xl !shadow-sm"
                    >
                        {submitText}
                    </Rb_Button>
                </div>
            </form>
        </div>
    );
}

function FormField({
    label,
    required = false,
    error,
    children,
}: {
    label: string;
    required?: boolean;
    error?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="min-w-0">
            <div className="mb-2 flex items-center gap-1">
                <Rb_Label>{label}</Rb_Label>

                {required && (
                    <span className="font-medium text-red-500">
                        *
                    </span>
                )}
            </div>

            {children}

            <ErrorText message={error} />
        </div>
    );
}

function ErrorText({ message }: { message?: string }) {
    if (!message) {
        return null;
    }

    return (
        <div className="mt-1.5 flex items-start gap-1">
            <FaCircle className="mt-1 text-[6px] text-red-500" />

            <p className="text-xs leading-4 text-red-600">
                {message}
            </p>
        </div>
    );
}