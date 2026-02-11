import { Handle, Position } from 'reactflow';
import { Zap, GitBranch, Play, CheckCircle, Clock, ShieldAlert, Mail, Smartphone, UserCheck } from 'lucide-react';

// Common Node Wrapper
const NodeWrapper = ({ children, type, label, icon: Icon, colorClass }: any) => (
    <div className={`shadow-lg rounded-lg border-2 bg-white dark:bg-dark-900 min-w-[200px] ${colorClass}`}>
        <div className={`p-2 border-b flex items-center gap-2 ${colorClass.replace('border-', 'bg-').replace('500', '500/10')}`}>
            <Icon className={`w-4 h-4 ${colorClass.replace('border-', 'text-')}`} />
            <span className="text-xs font-bold uppercase text-gray-700 dark:text-gray-300">{type}</span>
        </div>
        <div className="p-3">
            <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">{label}</div>
            {children}
        </div>
    </div>
);

export const TriggerNode = ({ data }: any) => {
    return (
        <NodeWrapper type="Trigger" label={data.label} icon={Zap} colorClass="border-yellow-500">
            <div className="text-xs text-gray-500 mt-1">{data.description}</div>
            <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-yellow-500" />
        </NodeWrapper>
    );
};

export const LogicNode = ({ data }: any) => {
    return (
        <NodeWrapper type="Logic" label={data.label} icon={GitBranch} colorClass="border-purple-500">
            <div className="text-xs text-gray-500 mt-1">{data.description}</div>
            <Handle type="target" position={Position.Top} className="w-3 h-3 bg-purple-500" />
            <Handle type="source" position={Position.Bottom} id="true" style={{ left: '30%' }} className="w-3 h-3 bg-green-500" />
            <Handle type="source" position={Position.Bottom} id="false" style={{ left: '70%' }} className="w-3 h-3 bg-red-500" />
            <div className="flex justify-between mt-2 text-[10px] font-bold text-gray-400 px-4">
                <span className="text-green-600">YES</span>
                <span className="text-red-600">NO</span>
            </div>
        </NodeWrapper>
    );
};

export const ActionNode = ({ data }: any) => {
    return (
        <NodeWrapper type="Action" label={data.label} icon={Play} colorClass="border-blue-500">
            <div className="text-xs text-gray-500 mt-1">{data.description}</div>
            <Handle type="target" position={Position.Top} className="w-3 h-3 bg-blue-500" />
            <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-blue-500" />
        </NodeWrapper>
    );
};

export const ApprovalNode = ({ data }: any) => {
    return (
        <NodeWrapper type="Approval" label={data.label} icon={UserCheck} colorClass="border-orange-500">
            <div className="text-xs text-gray-500 mt-1">{data.description}</div>
            <Handle type="target" position={Position.Top} className="w-3 h-3 bg-orange-500" />
            <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-orange-500" />
        </NodeWrapper>
    );
};

export const nodeTypes = {
    trigger: TriggerNode,
    logic: LogicNode,
    action: ActionNode,
    approval: ApprovalNode,
};
