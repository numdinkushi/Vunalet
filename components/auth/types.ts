export interface RegistrationFormData {
    role: 'farmer' | 'dispatcher' | 'buyer';
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
    location: string;
    businessName?: string;
    businessLicense?: string;
    // Farmer-specific fields
    bio?: string;
    farmSize?: string;
    experience?: string;
    specialties?: string[]; // Category IDs
    isOrganicCertified?: boolean;
    profilePicture?: string;
    coordinates?: {
        lat: number;
        lng: number;
    };
}

export interface RoleConfig {
    title: string;
    description: string;
    icon: React.ComponentType<any>;
    color: string;
    bgColor: string;
    borderColor: string;
}

export interface RegistrationStepProps {
    formData: RegistrationFormData;
    onInputChange: (field: keyof RegistrationFormData, value: string) => void;
    onRoleSelect: (role: 'farmer' | 'dispatcher' | 'buyer') => void;
    onNext: (e?: React.FormEvent) => void;
    onBack?: () => void;
    isSubmitting?: boolean;
} 