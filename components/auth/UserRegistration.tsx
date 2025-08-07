'use client';

import { useRegistration } from './hooks/use-registration';
import { RoleSelectionStep, ProfileFormStep } from './components';

export function UserRegistration() {
    const {
        formData,
        isSubmitting,
        step,
        setStep,
        handleInputChange,
        handleRoleSelect,
        validateForm,
        handleSubmit,
    } = useRegistration();

    const handleNext = () => {
        if (step === 1) {
            setStep(2);
        }
    };

    const handleBack = () => {
        setStep(1);
    };

    if (step === 1) {
        return (
            <RoleSelectionStep
                formData={formData}
                onInputChange={handleInputChange}
                onRoleSelect={handleRoleSelect}
                onNext={handleNext}
            />
        );
    }

    return (
        <ProfileFormStep
            formData={formData}
            onInputChange={handleInputChange}
            onRoleSelect={handleRoleSelect}
            onNext={handleSubmit}
            onBack={handleBack}
            isSubmitting={isSubmitting}
        />
    );
} 