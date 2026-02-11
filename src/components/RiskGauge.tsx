import { cn } from '../lib/utils';

interface RiskGaugeProps {
    score: number;
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({
    score,
    size = 'md',
    showLabel = true
}) => {
    const getColor = (score: number) => {
        if (score >= 80) return 'text-red-500';
        if (score >= 60) return 'text-orange-500';
        if (score >= 40) return 'text-yellow-500';
        return 'text-green-500';
    };

    const getLevel = (score: number) => {
        if (score >= 80) return 'Critical';
        if (score >= 60) return 'Warning';
        if (score >= 40) return 'Elevated';
        return 'Normal';
    };

    const getLevelKo = (score: number) => {
        if (score >= 80) return '위험';
        if (score >= 60) return '경고';
        if (score >= 40) return '주의';
        return '정상';
    };

    const sizeClasses = {
        sm: 'w-32 h-32',
        md: 'w-48 h-48',
        lg: 'w-64 h-64',
    };

    const textSizeClasses = {
        sm: 'text-2xl',
        md: 'text-4xl',
        lg: 'text-6xl',
    };

    // Calculate rotation for the needle (0-180 degrees)
    const rotation = (score / 100) * 180;

    return (
        <div className="flex flex-col items-center gap-4">
            <div className={cn('relative', sizeClasses[size])}>
                {/* Semi-circle background */}
                <svg viewBox="0 0 200 120" className="w-full h-full">
                    {/* Background arc */}
                    <path
                        d="M 20 100 A 80 80 0 0 1 180 100"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="20"
                        className="text-dark-800"
                    />

                    {/* Colored segments */}
                    <path
                        d="M 20 100 A 80 80 0 0 1 56 36"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="20"
                        className="text-green-500"
                    />
                    <path
                        d="M 56 36 A 80 80 0 0 1 100 20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="20"
                        className="text-yellow-500"
                    />
                    <path
                        d="M 100 20 A 80 80 0 0 1 144 36"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="20"
                        className="text-orange-500"
                    />
                    <path
                        d="M 144 36 A 80 80 0 0 1 180 100"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="20"
                        className="text-red-500"
                    />

                    {/* Needle */}
                    <line
                        x1="100"
                        y1="100"
                        x2="100"
                        y2="30"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        className={cn('transition-transform duration-1000', getColor(score))}
                        style={{
                            transformOrigin: '100px 100px',
                            transform: `rotate(${rotation - 90}deg)`
                        }}
                    />

                    {/* Center dot */}
                    <circle cx="100" cy="100" r="6" fill="currentColor" className="text-gray-100" />
                </svg>

                {/* Score display */}
                <div className="absolute inset-0 flex items-end justify-center pb-4">
                    <div className="text-center">
                        <div className={cn('font-bold', textSizeClasses[size], getColor(score))}>
                            {score}
                        </div>
                        {showLabel && (
                            <div className="text-sm text-gray-400 mt-1">
                                {getLevelKo(score)} ({getLevel(score)})
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
