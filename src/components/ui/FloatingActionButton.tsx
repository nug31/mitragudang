import React, { useState, useEffect } from "react";
import { Plus, X, ShoppingBag, ClipboardList, Package } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const FloatingActionButton: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const location = useLocation();

    // Hide on scroll down, show on scroll up
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setIsVisible(false);
                setIsOpen(false);
            } else {
                setIsVisible(true);
            }
            setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    // Hide FAB on certain pages or if needed
    const hiddenRoutes = ["/login", "/register", "/logout"];
    if (hiddenRoutes.includes(location.pathname)) return null;

    const toggleOpen = () => setIsOpen(!isOpen);

    const actions = [
        {
            label: "New Request",
            icon: ShoppingBag,
            to: "/new-request",
            color: "bg-primary-600",
        },
        {
            label: "Browse Items",
            icon: Package,
            to: "/browse",
            color: "bg-secondary-600",
        },
        {
            label: "My Requests",
            icon: ClipboardList,
            to: "/requests",
            color: "bg-teal-600",
        },
    ];

    return (
        <div
            className={`fixed bottom-24 right-6 z-40 sm:hidden transition-all duration-300 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
                }`}
        >
            {/* Action Menu */}
            <div
                className={`flex flex-col items-end space-y-3 mb-4 transition-all duration-300 ${isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0 pointer-events-none"
                    }`}
            >
                {actions.map((action, index) => (
                    <div
                        key={index}
                        className="flex items-center space-x-3 group"
                        style={{
                            transitionDelay: isOpen ? `${index * 50}ms` : '0ms',
                            transform: isOpen ? 'translateY(0)' : 'translateY(20px)'
                        }}
                    >
                        <span className="bg-white/90 backdrop-blur-md text-gray-700 px-3 py-1 rounded-lg text-sm font-medium shadow-lg border border-white/40">
                            {action.label}
                        </span>
                        <Link
                            to={action.to}
                            onClick={() => setIsOpen(false)}
                            className={`${action.color} text-white p-3 rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all animate-scale-in`}
                        >
                            <action.icon size={20} />
                        </Link>
                    </div>
                ))}
            </div>

            {/* Main Toggle Button */}
            <button
                onClick={toggleOpen}
                className={`p-4 rounded-[1.5rem] shadow-2xl flex items-center justify-center transition-all duration-500 hover:scale-105 active:scale-90 ${isOpen
                        ? "bg-gray-800 text-white rotate-90"
                        : "bg-gradient-to-br from-primary-500 to-secondary-600 text-white shadow-[0_8px_25px_rgba(37,99,235,0.4)]"
                    }`}
            >
                {isOpen ? <X size={24} /> : <Plus size={24} />}
            </button>
        </div>
    );
};

export default FloatingActionButton;
