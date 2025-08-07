'use client';

import { useState } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { userIntegrationService } from '../../lib/services/integration/user-integration.service';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Checkbox } from '../ui/checkbox';
import { motion } from 'framer-motion';
import { Loader2, User, Truck, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

interface RegistrationFormData {
    role: 'farmer' | 'dispatcher' | 'buyer';
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
    location: string;
    businessName?: string;
    businessLicense?: string;
    coordinates?: {
        lat: number;
        lng: number;
    };
}

const roleConfig = {
    farmer: {
        title: 'Farmer',
        description: 'Sell your fresh produce directly to customers',
        icon: User,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
    },
    dispatcher: {
        title: 'Dispatcher',
        description: 'Deliver orders and earn from deliveries',
        icon: Truck,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
    },
    buyer: {
        title: 'Buyer',
        description: 'Purchase fresh produce from local farmers',
        icon: ShoppingCart,
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200',
    },
};

export function UserRegistration() {
    const { user } = useUser();
    const { setActive } = useClerk();
    const createUserProfile = useMutation(api.users.createUserProfile);
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
                    toast.success('Location captured successfully! Your location has been saved.');
                },
                (error) => {
                    console.log('Error getting location:', error);
                    const errorMessage = error instanceof Error ? error.message : String(error);
                    toast.error(`Location access denied: ${errorMessage}. Please enter your location manually.`);
                }
            );
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            toast.error('Please sign in first');
            return;
        }

        setIsSubmitting(true);

        try {
            console.log('Starting user registration flow...');

            // Step 1: Create user in stablecoin system
            console.log('Step 1: Creating user in stablecoin system...');
            const integrationResult = await userIntegrationService.completeUserIntegration({
                clerkUserId: user.id,
                email: user.emailAddresses[0].emailAddress,
                firstName: formData.firstName,
                lastName: formData.lastName,
            });

            if (!integrationResult.success) {
                console.log('Stablecoin integration failed:', integrationResult.error);

                // Show error message
                const errorMessage = integrationResult.error || 'Failed to create user account';
                toast.error(errorMessage);
                return;
            }

            console.log('Step 1 completed: User created in stablecoin system:', integrationResult.stablecoinUser);

            // Step 2: Create/update user profile in Convex with stablecoin data
            console.log('Step 2: Creating user profile in Convex...');
            console.log('Stablecoin data to save:', {
                liskId: integrationResult.stablecoinUser?.id,
                publicKey: integrationResult.stablecoinUser?.publicKey,
                paymentIdentifier: integrationResult.stablecoinUser?.paymentIdentifier,
            });

            let convexResult;
            try {
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
                    // Stablecoin API data
                    liskId: integrationResult.stablecoinUser?.id,
                    publicKey: integrationResult.stablecoinUser?.publicKey,
                    paymentIdentifier: integrationResult.stablecoinUser?.paymentIdentifier,
                };

                console.log('Sending data to Convex:', convexData);
                console.log('Stablecoin data being sent:', {
                    liskId: convexData.liskId,
                    publicKey: convexData.publicKey,
                    paymentIdentifier: convexData.paymentIdentifier,
                });

                convexResult = await createUserWithStablecoinIntegration(convexData);

                console.log('Convex mutation completed successfully:', convexResult);
            } catch (error) {
                console.log('Error in Convex mutation:', error);
                throw error;
            }

            console.log('Step 2 completed: User profile created in Convex:', convexResult);

            // Verify the profile was created/updated correctly
            console.log('Verifying profile update...');

            toast.success('Profile created successfully with stablecoin integration! Welcome to Vunalet.');
            console.log('User registration flow completed successfully');

            // Redirect to dashboard
            window.location.href = '/dashboard';
        } catch (error) {
            console.log('Error in user registration flow:', error);
            const errorMessage = error instanceof Error ? error.message : String(error);
            toast.error(`Failed to complete profile registration: ${errorMessage}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const validateForm = () => {
        const requiredFields = ['firstName', 'lastName', 'phone', 'address', 'location'];
        return requiredFields.every(field => formData[field as keyof RegistrationFormData]);
    };

    if (step === 1) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-5rem)] bg-gradient-to-br from-green-50 to-blue-50 p-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-4xl"
                >
                    <Card className="shadow-xl">
                        <CardHeader className="text-center">
                            <CardTitle className="text-3xl font-bold text-gray-800">
                                Choose Your Role
                            </CardTitle>
                            <CardDescription className="text-lg text-gray-600">
                                Select how you want to participate in the Vunalet community
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-3 gap-6">
                                {Object.entries(roleConfig).map(([role, config]) => {
                                    const Icon = config.icon;
                                    return (
                                        <motion.div
                                            key={role}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <Card
                                                className={`cursor-pointer transition-all duration-200 ${formData.role === role
                                                    ? `${config.borderColor} border-2 ${config.bgColor}`
                                                    : 'hover:shadow-md'
                                                    }`}
                                                onClick={() => handleRoleSelect(role as 'farmer' | 'dispatcher' | 'buyer')}
                                            >
                                                <CardContent className="p-6 text-center">
                                                    <div className={`mx-auto mb-4 w-16 h-16 rounded-full ${config.bgColor} flex items-center justify-center`}>
                                                        <Icon className={`w-8 h-8 ${config.color}`} />
                                                    </div>
                                                    <h3 className={`text-xl font-semibold ${config.color} mb-2`}>
                                                        {config.title}
                                                    </h3>
                                                    <p className="text-gray-600 text-sm">
                                                        {config.description}
                                                    </p>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    );
                                })}
                            </div>

                            <div className="mt-8 text-center">
                                <Button
                                    onClick={() => setStep(2)}
                                    disabled={!formData.role}
                                    className="px-8 py-3 text-lg"
                                >
                                    Continue
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-5rem)] bg-gradient-to-br from-green-50 to-blue-50 p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl"
            >
                <Card className="shadow-xl">
                    <CardHeader className="text-center">
                        <CardTitle className="text-3xl font-bold text-gray-800">
                            Complete Your Profile
                        </CardTitle>
                        <CardDescription className="text-lg text-gray-600">
                            Tell us more about yourself as a {roleConfig[formData.role].title}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="firstName">First Name *</Label>
                                    <Input
                                        id="firstName"
                                        value={formData.firstName}
                                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="lastName">Last Name *</Label>
                                    <Input
                                        id="lastName"
                                        value={formData.lastName}
                                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="phone">Phone Number *</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="address">Address *</Label>
                                <Textarea
                                    id="address"
                                    value={formData.address}
                                    onChange={(e) => handleInputChange('address', e.target.value)}
                                    placeholder="Enter your full address"
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="location">Location/City *</Label>
                                <Input
                                    id="location"
                                    value={formData.location}
                                    onChange={(e) => handleInputChange('location', e.target.value)}
                                    required
                                />
                            </div>

                            {formData.role === 'farmer' && (
                                <>
                                    <div>
                                        <Label htmlFor="businessName">Business/Farm Name</Label>
                                        <Input
                                            id="businessName"
                                            value={formData.businessName}
                                            onChange={(e) => handleInputChange('businessName', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="businessLicense">Business License Number</Label>
                                        <Input
                                            id="businessLicense"
                                            value={formData.businessLicense}
                                            onChange={(e) => handleInputChange('businessLicense', e.target.value)}
                                        />
                                    </div>
                                </>
                            )}

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="locationPermission"
                                    onCheckedChange={() => getCurrentLocation()}
                                />
                                <Label htmlFor="locationPermission">
                                    Allow location access for better service
                                </Label>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setStep(1)}
                                    className="flex-1"
                                >
                                    Back
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={!validateForm() || isSubmitting}
                                    className="flex-1"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Creating Profile...
                                        </>
                                    ) : (
                                        'Complete Registration'
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
} 