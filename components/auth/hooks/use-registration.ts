import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { userIntegrationService } from '../../../lib/services/integration/user-integration.service';
import { RegistrationFormData } from '../types';
import { toast } from 'sonner';

export function useRegistration() {
    const { user } = useUser();
    const createUserWithStablecoinIntegration = useMutation(api.users.createUserWithStablecoinIntegration);

    const [formData, setFormData] = useState<RegistrationFormData>({
        role: 'buyer',
        firstName: '',
        lastName: '',
        phone: '',
        address: '',
        location: '',
        businessName: '',
        businessLicense: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [step, setStep] = useState(1);

    const handleInputChange = (field: keyof RegistrationFormData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleRoleSelect = (role: 'farmer' | 'dispatcher' | 'buyer') => {
        setFormData(prev => ({ ...prev, role }));
    };

    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setFormData(prev => ({
                        ...prev,
                        coordinates: {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                        }
                    }));
                    toast.success('Location captured successfully!');
                },
                (error) => {
                    console.error('Error getting location:', error);
                    toast.error('Location access denied. Please enter your location manually.');
                }
            );
        }
    };

    const validateForm = () => {
        const requiredFields = ['firstName', 'lastName', 'phone', 'address', 'location'];
        return requiredFields.every(field => formData[field as keyof RegistrationFormData]);
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();

        if (!user) {
            toast.error('Please sign in first');
            return;
        }

        setIsSubmitting(true);

        try {
            // Step 1: Create user in stablecoin system and activate payment
            const integrationResult = await userIntegrationService.completeUserIntegration({
                clerkUserId: user.id,
                email: user.emailAddresses[0].emailAddress,
                firstName: formData.firstName,
                lastName: formData.lastName,
            });

            if (!integrationResult.success) {
                toast.error(integrationResult.error || 'Failed to create user account');
                return;
            }

            // Step 2: Create user profile in Convex with stablecoin data
            const convexData = {
                clerkUserId: user.id,
                email: user.emailAddresses[0].emailAddress,
                role: formData.role,
                firstName: formData.firstName,
                lastName: formData.lastName,
                phone: formData.phone,
                address: formData.address,
                location: formData.location,
                businessName: formData.businessName,
                businessLicense: formData.businessLicense,
                coordinates: formData.coordinates,
                liskId: integrationResult.stablecoinUser?.id,
                publicKey: integrationResult.stablecoinUser?.publicKey,
                paymentIdentifier: integrationResult.stablecoinUser?.paymentIdentifier,
            };

            await createUserWithStablecoinIntegration(convexData);

            toast.success('Profile created successfully with payment activation! Welcome to Vunalet.');
            window.location.href = '/dashboard';
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            toast.error(`Failed to complete profile registration: ${errorMessage}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        formData,
        isSubmitting,
        step,
        setStep,
        handleInputChange,
        handleRoleSelect,
        getCurrentLocation,
        validateForm,
        handleSubmit,
    };
} 