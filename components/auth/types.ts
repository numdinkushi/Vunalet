import { SouthAfricanAddressData } from '../ui/south-african-address';

export interface RegistrationFormData {
    role: 'farmer' | 'dispatcher' | 'buyer';
    firstName: string;
    lastName: string;
    phone: string;
    // New South African address structure
    address: SouthAfricanAddressData;
    // Legacy fields for backward compatibility
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
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    color: string;
    bgColor: string;
    borderColor: string;
}

export interface RegistrationStepProps {
    formData: RegistrationFormData;
    onInputChange: (field: keyof RegistrationFormData, value: string | SouthAfricanAddressData) => void;
    onRoleSelect: (role: 'farmer' | 'dispatcher' | 'buyer') => void;
    onNext: (e?: React.FormEvent) => void;
    onBack?: () => void;
    isSubmitting?: boolean;
} 