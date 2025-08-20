import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Checkbox } from '../../ui/checkbox';
import { ProfileImageUpload } from '../../ui/profile-image-upload';
import { MultiSelect } from '../../ui/multi-select';
import { SouthAfricanAddress } from '../../ui/south-african-address';
import { Loader2, Leaf } from 'lucide-react';
import { roleConfig } from '../constants';
import { RegistrationStepProps } from '../types';
import { categories } from '../../../constants/categories';

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
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4 pt-24">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl"
            >
                <Card className="shadow-xl border-0">
                    <CardHeader className="text-center pb-8">
                        <CardTitle className="text-3xl font-bold text-gray-800 mb-4">
                            Complete Your Profile
                        </CardTitle>
                        <CardDescription className="text-lg text-gray-600">
                            Tell us more about yourself as a {roleConfig[formData.role].title}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="px-8 pb-8">
                        <form onSubmit={(e) => { e.preventDefault(); onNext(e); }} className="space-y-8">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="firstName" className="text-sm font-medium text-gray-700 mb-2 block">
                                        First Name *
                                    </Label>
                                    <Input
                                        id="firstName"
                                        value={formData.firstName}
                                        onChange={(e) => onInputChange('firstName', e.target.value)}
                                        required
                                        className="h-11"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="lastName" className="text-sm font-medium text-gray-700 mb-2 block">
                                        Last Name *
                                    </Label>
                                    <Input
                                        id="lastName"
                                        value={formData.lastName}
                                        onChange={(e) => onInputChange('lastName', e.target.value)}
                                        required
                                        className="h-11"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="phone" className="text-sm font-medium text-gray-700 mb-2 block">
                                    Phone Number *
                                </Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => onInputChange('phone', e.target.value)}
                                    required
                                    className="h-11"
                                />
                            </div>

                            {/* South African Address Component */}
                            <SouthAfricanAddress
                                value={formData.address}
                                onChange={(address) => onInputChange('address', address)}
                                label="Address"
                            />

                            {formData.role === 'farmer' && (
                                <>
                                    <div>
                                        <Label htmlFor="businessName" className="text-sm font-medium text-gray-700 mb-2 block">
                                            Business/Farm Name
                                        </Label>
                                        <Input
                                            id="businessName"
                                            value={formData.businessName}
                                            onChange={(e) => onInputChange('businessName', e.target.value)}
                                            className="h-11"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="businessLicense" className="text-sm font-medium text-gray-700 mb-2 block">
                                            Business License Number
                                        </Label>
                                        <Input
                                            id="businessLicense"
                                            value={formData.businessLicense}
                                            onChange={(e) => onInputChange('businessLicense', e.target.value)}
                                            className="h-11"
                                        />
                                    </div>

                                    {/* Farmer-specific fields */}
                                    <div className="border-t border-gray-200 pt-8 mt-8">
                                        <h3 className="text-xl font-semibold text-gray-800 mb-6">Farm Information</h3>

                                        <div className="space-y-4">
                                            <div>
                                                <Label htmlFor="bio" className="text-sm font-medium text-gray-700 mb-2 block">
                                                    Bio/Description
                                                </Label>
                                                <Textarea
                                                    id="bio"
                                                    value={formData.bio}
                                                    onChange={(e) => onInputChange('bio', e.target.value)}
                                                    placeholder="Tell us about your farming experience and philosophy..."
                                                    rows={4}
                                                    className="min-h-[100px]"
                                                />
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div>
                                                    <Label htmlFor="farmSize" className="text-sm font-medium text-gray-700 mb-2 block">
                                                        Farm Size
                                                    </Label>
                                                    <Input
                                                        id="farmSize"
                                                        value={formData.farmSize}
                                                        onChange={(e) => onInputChange('farmSize', e.target.value)}
                                                        placeholder="e.g., 5 hectares"
                                                        className="h-11"
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="experience" className="text-sm font-medium text-gray-700 mb-2 block">
                                                        Years of Experience
                                                    </Label>
                                                    <Input
                                                        id="experience"
                                                        value={formData.experience}
                                                        onChange={(e) => onInputChange('experience', e.target.value)}
                                                        placeholder="e.g., 10+ years"
                                                        className="h-11"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <MultiSelect
                                                    options={categories}
                                                    value={formData.specialties || []}
                                                    onChange={(selectedIds) => onInputChange('specialties', JSON.stringify(selectedIds))}
                                                    label="Farming Specialties"
                                                    placeholder="Select your farming categories..."
                                                    maxSelections={5}
                                                />
                                            </div>

                                            <div>
                                                <ProfileImageUpload
                                                    value={formData.profilePicture}
                                                    onChange={(url) => onInputChange('profilePicture', url)}
                                                    label="Profile Picture"
                                                    placeholder="Upload your profile picture"
                                                />
                                            </div>

                                            <div className="flex items-center space-x-3">
                                                <Checkbox
                                                    id="isOrganicCertified"
                                                    checked={formData.isOrganicCertified}
                                                    onCheckedChange={(checked) => {
                                                        onInputChange('isOrganicCertified', checked ? 'true' : 'false');
                                                    }}
                                                />
                                                <Label htmlFor="isOrganicCertified" className="flex items-center text-sm text-gray-700">
                                                    <Leaf className="w-4 h-4 mr-2 text-green-600" />
                                                    I am organic certified
                                                </Label>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                            <div className="flex items-center space-x-3 pt-4">
                                <Checkbox
                                    id="locationPermission"
                                    onCheckedChange={() => getCurrentLocation()}
                                />
                                <Label htmlFor="locationPermission" className="text-sm text-gray-700">
                                    Allow location access for better service
                                </Label>
                            </div>

                            <div className="flex gap-4 pt-6">
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