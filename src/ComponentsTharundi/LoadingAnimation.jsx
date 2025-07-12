import React from 'react'
import { LoaderPinwheel } from 'lucide-react';

const LoadingAnimation = () => {
    return (
        <div className="text-center text-slate-400 py-8 flex flex-col items-center justify-center h-screen">
            <LoaderPinwheel size={48} className="mx-auto mb-3 text-slate-500 animate-spin" />
            <p>Loading messages...</p>
        </div>
    )
}

export default LoadingAnimation