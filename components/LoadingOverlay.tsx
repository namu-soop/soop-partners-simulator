'use client';

interface LoadingOverlayProps {
    isLoading: boolean;
    message?: string;
}

export default function LoadingOverlay({ isLoading, message = '계산 중입니다...' }: LoadingOverlayProps) {
    if (!isLoading) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center flex-col z-[1000]">
            <div className="spinner"></div>
            <p className="text-white mt-4 text-lg">{message}</p>
        </div>
    );
}
