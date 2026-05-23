export function getStatusStyle(status: string) {
    if (status === 'unterwegs') return 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm'
    if (status === 'geplant') return 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm'
    return 'bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm'
}