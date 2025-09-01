import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface CallWaiterDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

interface Prompt {
    id: string;
    text: string;
}

export function CallWaiterDialog({ isOpen, onClose }: CallWaiterDialogProps) {
    const [prompts, setPrompts] = useState<Prompt[]>([]);
    const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
    const [customNote, setCustomNote] = useState('');

    // Fetch prompts from backend
    useEffect(() => {
        if (!isOpen) return;

        const fetchPrompts = async () => {
            try {
                const res = await fetch(`/api/v1/customer-waiter-prompts`);
                const data = await res.json();
                setPrompts(data);
            } catch (err) {
                console.error('Failed to load prompts', err);
                setPrompts([
                    { id: '1', text: 'Calling for Order' },
                    { id: '2', text: 'Calling Shisha Master' },
                    { id: '3', text: 'Bring Second Tea Pot' },
                ]);
            }
        };

        fetchPrompts();
    }, [isOpen]);

    const handleSubmit = async () => {
        const payload = {
            promptId: selectedPrompt,
            note: customNote,
        };

        try {
            await fetch(`/api/v1/customer-waiter-prompts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            onClose();
        } catch (err) {
            console.error('Failed to send waiter request', err);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Call Waiter</DialogTitle>
                </DialogHeader>

                <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                        {prompts.map((p) => (
                            <Button
                                key={p.id}
                                variant={selectedPrompt === p.id ? 'default' : 'outline'}
                                onClick={() => setSelectedPrompt(p.id)}
                                className={`px-4 py-2 rounded-full text-sm border
        ${selectedPrompt === p.id
                                        ? 'bg-primary text-primary-foreground border-primary'
                                        : 'bg-background text-foreground border-muted-foreground'}
      `}
                            >
                                {p.text}
                            </Button>
                        ))}
                    </div>

                    <Input
                        placeholder="Write a note..."
                        value={customNote}
                        onChange={(e) => setCustomNote(e.target.value)}
                        className="border border-gray-200"
                    />
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={!selectedPrompt && !customNote}>
                        Send Request
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
