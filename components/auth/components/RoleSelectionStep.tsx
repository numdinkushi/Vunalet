import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { ShoppingCart, Info } from 'lucide-react';
import { roleConfig } from '../constants';
import { RegistrationStepProps } from '../types';

export function RoleSelectionStep({ formData, onRoleSelect, onNext }: RegistrationStepProps) {
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
                                const isBuyer = role === 'buyer';
                                return (
                                    <motion.div
                                        key={role}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Card
                                            className={`cursor-pointer transition-all duration-200 relative ${formData.role === role
                                                    ? `${config.borderColor} border-2 ${config.bgColor}`
                                                    : 'hover:shadow-md'
                                                }`}
                                            onClick={() => onRoleSelect(role as 'farmer' | 'dispatcher' | 'buyer')}
                                        >
                                            <CardContent className="p-6 text-center">
                                                <div className={`mx-auto mb-4 w-16 h-16 rounded-full ${config.bgColor} flex items-center justify-center`}>
                                                    <Icon className={`w-8 h-8 ${config.color}`} />
                                                </div>
                                                <h3 className={`text-xl font-semibold ${config.color} mb-2`}>
                                                    {config.title}
                                                </h3>
                                                <p className="text-gray-600 text-sm mb-3">
                                                    {config.description}
                                                </p>
                                                
                                                {/* Purchase capability indicator for buyer */}
                                                {isBuyer && (
                                                    <div className="flex items-center justify-center">
                                                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                                                            <ShoppingCart className="w-3 h-3 mr-1" />
                                                            Can purchase products
                                                        </Badge>
                                                    </div>
                                                )}
                                                
                                                {/* Non-purchase indicator for other roles */}
                                                {!isBuyer && (
                                                    <div className="flex items-center justify-center">
                                                        <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200 text-xs">
                                                            Cannot purchase products
                                                        </Badge>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                );
                            })}
                        </div>

                        <div className="mt-8 text-center">
                            <Button
                                onClick={onNext}
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