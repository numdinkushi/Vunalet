import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Checkbox } from '../../ui/checkbox';
import { Loader2 } from 'lucide-react';
import { roleConfig } from '../constants';
import { RegistrationStepProps } from '../types';

export function ProfileFormStep({
    formData,
    onInputChange,
    onBack,
    onNext,
    isSubmitting
}: RegistrationStepProps) {
    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    onInputChange('coordinates', JSON.stringify({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    }));
                },
                (error) => {
                    console.error('Error getting location:', error);
                }
            );
        }
    };

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
                        <form onSubmit={onNext} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="firstName">First Name *</Label>
                                    <Input
                                        id="firstName"
                                        value={formData.firstName}
                                        onChange={(e) => onInputChange('firstName', e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="lastName">Last Name *</Label>
                                    <Input
                                        id="lastName"
                                        value={formData.lastName}
                                        onChange={(e) => onInputChange('lastName', e.target.value)}
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
                                    onChange={(e) => onInputChange('phone', e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="address">Address *</Label>
                                <Textarea
                                    id="address"
                                    value={formData.address}
                                    onChange={(e) => onInputChange('address', e.target.value)}
                                    placeholder="Enter your full address"
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="location">Location/City *</Label>
                                <Input
                                    id="location"
                                    value={formData.location}
                                    onChange={(e) => onInputChange('location', e.target.value)}
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
                                            onChange={(e) => onInputChange('businessName', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="businessLicense">Business License Number</Label>
                                        <Input
                                            id="businessLicense"
                                            value={formData.businessLicense}
                                            onChange={(e) => onInputChange('businessLicense', e.target.value)}
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
                                    onClick={onBack}
                                    className="flex-1"
                                >
                                    Back
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
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