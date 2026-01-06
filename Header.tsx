import React from 'react';
import { LogOut, X, ArrowLeft } from 'lucide-react';
import { User, UserLevel } from '../types';

interface DashboardHeaderProps {
    variant: 'dashboard';
    user: User;
    onLogout: () => void;
}

interface PageHeaderProps {
    variant: 'page';
    title: string;
    onBack: () => void;
    icon?: React.ReactNode;
}

type Props = DashboardHeaderProps | PageHeaderProps;

const Header: React.FC<Props> = (props) => {
    if (props.variant === 'dashboard') {
        return (
            <header className="bg-primary text-white p-6 rounded-b-3xl shadow-lg mb-6 shrink-0">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold">Olá, {props.user.name.split(' ')[0]}</h1>
                        <p className="text-blue-100 opacity-90 text-sm mt-1">
                            {props.user.level === UserLevel.ADMIN ? 'Administrador' : 'Operador'}
                        </p>
                    </div>
                    <button
                        onClick={props.onLogout}
                        className="bg-white/20 p-2 rounded-lg hover:bg-white/30 transition backdrop-blur-sm"
                        aria-label="Sair"
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            </header>
        );
    }

    // Page variant
    return (
        <div className="flex justify-between items-center mb-6 shrink-0">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                {props.icon}
                {props.title}
            </h2>
            <button onClick={props.onBack} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
            </button>
        </div>
    );
};

export default Header;
