export const formatCurrency = (amount: number) => {
    return `R ${amount.toLocaleString('en-ZA', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
};

export const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

export const getStatusColor = (status: string) => {
    const colors = {
        active: 'bg-green-100 text-green-800',
        inactive: 'bg-gray-100 text-gray-800',
        pending: 'bg-yellow-100 text-yellow-800',
        delivered: 'bg-blue-100 text-blue-800',
        cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
};

export const getOrderStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
}; 