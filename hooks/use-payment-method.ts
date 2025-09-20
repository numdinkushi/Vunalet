import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { PaymentMethod, convertZarToCelo, convertCeloToZar } from '@/constants';
import { useWalletBalance } from './use-wallet-balance';

interface PaymentMethodResult {
    // Current selection
    selectedMethod: PaymentMethod;
    
    // Available methods
    availableMethods: PaymentMethod[];
    
    // Balance checks
    hasSufficientLiskZar: boolean;
    hasSufficientCelo: boolean;
    recommendedMethod: PaymentMethod;
    
    // Actions
    setPaymentMethod: (method: PaymentMethod) => Promise<void>;
    getAmountInSelectedCurrency: (zarAmount: number) => number;
    getFormattedAmount: (zarAmount: number) => string;
}

interface UsePaymentMethodProps {
    zarAmount: number;
    initialMethod?: PaymentMethod;
}

export function usePaymentMethod({ zarAmount, initialMethod }: UsePaymentMethodProps): PaymentMethodResult {
    const { user } = useUser();
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(
        initialMethod || PaymentMethod.LISK_ZAR
    );

    // Get user profile for payment preferences
    const userProfile = useQuery(api.users.getUserProfile, {
        clerkUserId: user?.id || '',
    });

    // Get wallet balances
    const { celoBalance, liskZarBalance, isWalletConnected } = useWalletBalance();

    // Mutation to update user's preferred payment method
    const updatePreferredPaymentMethod = useMutation(api.users.updatePreferredPaymentMethod);

    // Calculate if user has sufficient funds for each method
    const hasSufficientLiskZar = liskZarBalance >= zarAmount;
    const hasSufficientCelo = isWalletConnected && celoBalance >= convertZarToCelo(zarAmount);

    // Determine available payment methods
    const availableMethods: PaymentMethod[] = [];
    
    if (hasSufficientLiskZar) {
        availableMethods.push(PaymentMethod.LISK_ZAR);
    }
    
    if (hasSufficientCelo) {
        availableMethods.push(PaymentMethod.CELO);
    }
    
    // Always include cash as fallback
    availableMethods.push(PaymentMethod.CASH);

    // Determine recommended payment method
    const getRecommendedMethod = (): PaymentMethod => {
        // If user has a preferred method and sufficient funds, use it
        if (userProfile?.preferredPaymentMethod) {
            const preferred = userProfile.preferredPaymentMethod as PaymentMethod;
            if (preferred === PaymentMethod.LISK_ZAR && hasSufficientLiskZar) {
                return PaymentMethod.LISK_ZAR;
            }
            if (preferred === PaymentMethod.CELO && hasSufficientCelo) {
                return PaymentMethod.CELO;
            }
        }

        // Auto-recommend based on available funds
        if (hasSufficientCelo) {
            return PaymentMethod.CELO; // Prefer CELO if available
        }
        if (hasSufficientLiskZar) {
            return PaymentMethod.LISK_ZAR;
        }
        
        return PaymentMethod.CASH; // Fallback to cash
    };

    const recommendedMethod = getRecommendedMethod();

    // Set initial method based on recommendation if no initial method provided
    useEffect(() => {
        if (!initialMethod && recommendedMethod !== selectedMethod) {
            setSelectedMethod(recommendedMethod);
        }
    }, [recommendedMethod, initialMethod, selectedMethod]);

    // Update payment method and save preference
    const setPaymentMethod = async (method: PaymentMethod) => {
        setSelectedMethod(method);
        
        // Save as user preference
        if (user?.id) {
            try {
                await updatePreferredPaymentMethod({
                    clerkUserId: user.id,
                    preferredPaymentMethod: method,
                });
            } catch (error) {
                console.error('Failed to update preferred payment method:', error);
            }
        }
    };

    // Get amount in selected currency
    const getAmountInSelectedCurrency = (amount: number): number => {
        switch (selectedMethod) {
            case PaymentMethod.CELO:
                return convertZarToCelo(amount);
            case PaymentMethod.LISK_ZAR:
            case PaymentMethod.CASH:
            default:
                return amount;
        }
    };

    // Get formatted amount string
    const getFormattedAmount = (amount: number): string => {
        const currencyAmount = getAmountInSelectedCurrency(amount);
        
        switch (selectedMethod) {
            case PaymentMethod.CELO:
                return `${currencyAmount.toFixed(6)} CELO`;
            case PaymentMethod.LISK_ZAR:
                return `R ${currencyAmount.toFixed(2)}`;
            case PaymentMethod.CASH:
                return `R ${currencyAmount.toFixed(2)}`;
            default:
                return `R ${currencyAmount.toFixed(2)}`;
        }
    };

    return {
        // Current selection
        selectedMethod,
        
        // Available methods
        availableMethods,
        
        // Balance checks
        hasSufficientLiskZar,
        hasSufficientCelo,
        recommendedMethod,
        
        // Actions
        setPaymentMethod,
        getAmountInSelectedCurrency,
        getFormattedAmount,
    };
}
