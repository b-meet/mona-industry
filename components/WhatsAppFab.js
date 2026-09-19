"use client";

import { usePathname } from 'next/navigation';
import WhatsAppIcon from '@/components/WhatsAppIcon';
import { whatsappUrl } from '@/constants/company';

// Internal screens don't need a sales CTA floating over them.
const HIDDEN_ON = ['/master', '/admin'];

export default function WhatsAppFab() {
    const pathname = usePathname();

    if (HIDDEN_ON.some((route) => pathname.startsWith(route))) return null;

    return (
        <a
            href={whatsappUrl('Hello Mona Industry, I would like to enquire about your cables.')}
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-fab"
            aria-label="Chat with us on WhatsApp"
        >
            <WhatsAppIcon size={26} />
            <span className="whatsapp-fab-label">Chat on WhatsApp</span>
        </a>
    );
}
