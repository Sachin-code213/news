import React from 'react';
import { LogOut, AlertTriangle, X } from 'lucide-react';
import { Button } from '../../components/ui/button';

interface LogoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 animate-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="flex flex-col items-center text-center">
                    <div className="h-16 w-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                        <AlertTriangle className="h-8 w-8 text-red-600" />
                    </div>

                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Confirm Logout</h3>
                    <p className="text-sm text-slate-500 mt-2 font-medium">
                        Are you sure you want to end your session, <span className="text-slate-900 font-bold">Sachin</span>?
                    </p>

                    <div className="grid grid-cols-2 gap-3 w-full mt-8">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="font-bold border-2"
                        >
                            Stay Here
                        </Button>
                        <Button
                            onClick={onConfirm}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold flex items-center justify-center gap-2"
                        >
                            <LogOut size={16} /> Logout
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LogoutModal;