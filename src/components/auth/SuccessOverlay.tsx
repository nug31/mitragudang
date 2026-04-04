import React, { useState, useEffect } from 'react';
import { CheckCircle2, Loader2, ShieldCheck, Zap } from 'lucide-react';

interface SuccessOverlayProps {
    isVisible: boolean;
    status?: 'loading' | 'success';
    message?: string;
}

const SuccessOverlay: React.FC<SuccessOverlayProps> = ({
    isVisible,
    status = 'loading',
    message
}) => {
    const [activeStatus, setActiveStatus] = useState<'loading' | 'success'>(status);

    useEffect(() => {
        setActiveStatus(status);
    }, [status]);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0f18]/95 backdrop-blur-2xl animate-fade-in transition-all duration-500">
            <div className="text-center space-y-10 max-w-sm px-6 relative">

                {/* Stage 1: Loading / Authenticating */}
                {activeStatus === 'loading' && (
                    <div className="space-y-8 animate-fade-in">
                        <div className="relative flex justify-center">
                            <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping opacity-75"></div>
                            <div className="relative bg-blue-900/40 rounded-full p-8 border border-blue-500/30 shadow-[0_0_50px_rgba(37,99,235,0.2)]">
                                <Loader2 className="w-16 h-16 text-blue-400 animate-spin stroke-[1.5px]" />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <h2 className="text-3xl font-black text-white tracking-tight animate-pulse">
                                Authenticating
                            </h2>
                            <p className="text-blue-400/60 text-xs font-bold uppercase tracking-[0.3em]">
                                Securing Connection...
                            </p>
                        </div>
                    </div>
                )}

                {/* Stage 2: Success / Welcome */}
                {activeStatus === 'success' && (
                    <div className="space-y-8 animate-scale-in">
                        <div className="relative flex justify-center">
                            <div className="absolute inset-0 bg-teal-500/30 rounded-full animate-ping"></div>
                            <div className="relative bg-teal-500 rounded-full p-8 shadow-[0_0_60px_rgba(20,184,166,0.4)] transition-all duration-500">
                                <CheckCircle2 className="w-16 h-16 text-white stroke-[3px]" />
                            </div>

                            {/* Decorative Floating Elements */}
                            <Zap className="absolute -top-4 -right-4 w-8 h-8 text-yellow-400 animate-bounce delay-100" />
                            <ShieldCheck className="absolute -bottom-4 -left-4 w-8 h-8 text-blue-400 animate-bounce delay-300" />
                        </div>

                        <div className="space-y-3">
                            <h2 className="text-4xl font-black text-white tracking-tight">
                                {message || "Access Granted"}
                            </h2>
                            <div className="flex items-center justify-center space-x-3 text-teal-400 font-medium">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span className="tracking-widest uppercase text-xs">Entering Workspace...</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Dynamic Background Particles */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className={`absolute rounded-full blur-[1px] animate-float ${activeStatus === 'loading' ? 'bg-blue-500/20' : 'bg-teal-500/30'}`}
                            style={{
                                width: `${Math.random() * 6 + 2}px`,
                                height: `${Math.random() * 6 + 2}px`,
                                left: `${Math.random() * 150 - 25}%`,
                                top: `${Math.random() * 150 - 25}%`,
                                animationDuration: `${Math.random() * 3 + 2}s`,
                                animationDelay: `${Math.random() * 2}s`,
                            }}
                        ></div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SuccessOverlay;
