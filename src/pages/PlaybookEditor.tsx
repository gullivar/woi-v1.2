import { useState, useCallback, useRef } from 'react';
import ReactFlow, {
    ReactFlowProvider,
    addEdge,
    useNodesState,
    useEdgesState,
    Controls,
    Background,
    MiniMap,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { nodeTypes } from '../components/Playbook/CustomNodes';
import { Zap, GitBranch, Play, UserCheck, Save, Play as PlayIcon } from 'lucide-react';

const initialNodes = [
    {
        id: '1',
        type: 'trigger',
        position: { x: 250, y: 50 },
        data: { label: 'Detection Rule', description: 'Impossible Travel Detected' },
    },
    {
        id: '2',
        type: 'logic',
        position: { x: 250, y: 200 },
        data: { label: 'Is VIP User?', description: 'Check user group' },
    },
];

const initialEdges = [
    { id: 'e1-2', source: '1', target: '2', animated: true },
];

let id = 3;
const getId = () => `${id++}`;

const PlaybookEditorContent = () => {
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

    const onConnect = useCallback(
        (params: any) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );

    const onDragOver = useCallback((event: any) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event: any) => {
            event.preventDefault();

            const type = event.dataTransfer.getData('application/reactflow');
            const label = event.dataTransfer.getData('application/label');
            const description = event.dataTransfer.getData('application/description');

            if (typeof type === 'undefined' || !type) {
                return;
            }

            const position = reactFlowInstance?.project({
                x: event.clientX - (reactFlowWrapper.current?.getBoundingClientRect().left || 0),
                y: event.clientY - (reactFlowWrapper.current?.getBoundingClientRect().top || 0),
            }) || { x: 0, y: 0 };

            const newNode = {
                id: getId(),
                type,
                position,
                data: { label: label, description: description },
            };

            setNodes((nds) => nds.concat(newNode));
        },
        [reactFlowInstance, setNodes]
    );

    const onDragStart = (event: any, nodeType: string, label: string, desc: string) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.setData('application/label', label);
        event.dataTransfer.setData('application/description', desc);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <div className="flex h-[calc(100vh-4rem)] bg-gray-50 dark:bg-dark-950">
            {/* Sidebar */}
            <div className="w-64 bg-white dark:bg-dark-900 border-r border-gray-200 dark:border-dark-800 p-4 flex flex-col">
                <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">NODE LIBRARY</h3>
                    <div className="space-y-3">
                        <div className="space-y-2">
                            <div className="text-xs font-medium text-gray-500 uppercase">Triggers</div>
                            <div
                                className="p-3 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-700/30 rounded cursor-move hover:shadow-md transition-all flex items-center gap-2"
                                onDragStart={(event) => onDragStart(event, 'trigger', 'Detection Rule', 'Trigger on specific rule')}
                                draggable
                            >
                                <Zap className="w-4 h-4 text-yellow-600" />
                                <span className="text-sm text-gray-700 dark:text-gray-300">Detection Rule</span>
                            </div>
                            <div
                                className="p-3 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-700/30 rounded cursor-move hover:shadow-md transition-all flex items-center gap-2"
                                onDragStart={(event) => onDragStart(event, 'trigger', 'Schedule', 'Run periodically')}
                                draggable
                            >
                                <Zap className="w-4 h-4 text-yellow-600" />
                                <span className="text-sm text-gray-700 dark:text-gray-300">Schedule</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="text-xs font-medium text-gray-500 uppercase">Logic</div>
                            <div
                                className="p-3 bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-700/30 rounded cursor-move hover:shadow-md transition-all flex items-center gap-2"
                                onDragStart={(event) => onDragStart(event, 'logic', 'Filter', 'Check conditions')}
                                draggable
                            >
                                <GitBranch className="w-4 h-4 text-purple-600" />
                                <span className="text-sm text-gray-700 dark:text-gray-300">Filter / Condition</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="text-xs font-medium text-gray-500 uppercase">Actions</div>
                            <div
                                className="p-3 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-700/30 rounded cursor-move hover:shadow-md transition-all flex items-center gap-2"
                                onDragStart={(event) => onDragStart(event, 'action', 'UEM Command', 'Wipe, Lock, etc.')}
                                draggable
                            >
                                <Play className="w-4 h-4 text-blue-600" />
                                <span className="text-sm text-gray-700 dark:text-gray-300">UEM Command</span>
                            </div>
                            <div
                                className="p-3 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-700/30 rounded cursor-move hover:shadow-md transition-all flex items-center gap-2"
                                onDragStart={(event) => onDragStart(event, 'action', 'Notification', 'Email, Slack, Teams')}
                                draggable
                            >
                                <Play className="w-4 h-4 text-blue-600" />
                                <span className="text-sm text-gray-700 dark:text-gray-300">Notification</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="text-xs font-medium text-gray-500 uppercase">Approval</div>
                            <div
                                className="p-3 bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-700/30 rounded cursor-move hover:shadow-md transition-all flex items-center gap-2"
                                onDragStart={(event) => onDragStart(event, 'approval', 'Wait for Approval', 'Manual intervention')}
                                draggable
                            >
                                <UserCheck className="w-4 h-4 text-orange-600" />
                                <span className="text-sm text-gray-700 dark:text-gray-300">Wait for Approval</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Canvas Area */}
            <div className="flex-1 flex flex-col h-full" ref={reactFlowWrapper}>
                {/* Toolbar */}
                <div className="bg-white dark:bg-dark-900 border-b border-gray-200 dark:border-dark-800 px-6 py-3 flex items-center justify-between z-10">
                    <div>
                        <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">Playbook: Impossible Travel Response</h1>
                        <p className="text-xs text-gray-500">Last edited: Just now</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-dark-800 hover:bg-gray-200 dark:hover:bg-dark-700 rounded-lg transition-colors">
                            <Save className="w-4 h-4" /> Save
                        </button>
                        <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-enterprise-500 hover:bg-enterprise-600 rounded-lg transition-colors">
                            <PlayIcon className="w-4 h-4" /> Run Test
                        </button>
                    </div>
                </div>

                {/* ReactFlow Canvas */}
                <div className="flex-1 h-full" style={{ minHeight: '500px' }}>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onInit={setReactFlowInstance}
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                        nodeTypes={nodeTypes}
                        fitView
                    >
                        <Controls />
                        <MiniMap />
                        <Background gap={12} size={1} />
                    </ReactFlow>
                </div>
            </div>
        </div>
    );
};

export const PlaybookEditor = () => (
    <ReactFlowProvider>
        <PlaybookEditorContent />
    </ReactFlowProvider>
);
