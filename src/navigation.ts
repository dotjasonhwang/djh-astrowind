import { getPermalink, getBlogPermalink } from './utils/permalinks';

export const headerData = {
    links: [
        {
            text: 'About',
            href: getPermalink('/about'),
        },
        {
            text: 'Services',
            href: getPermalink('/services'),
            links: [
                { text: 'Service 1', href: getPermalink('/services1') },
                { text: 'Service 2', href: getPermalink('/services2') },
                { text: 'Service 3', href: getPermalink('/services3') },
            ],
        },
        {
            text: 'Reviews',
            href: getPermalink('/reviews'),
        },
        {
            text: 'Pricing',
            href: getPermalink('/pricing'),
        },
        {
            text: 'Blog',
            href: getBlogPermalink(),
        },
        {
            text: 'Contact',
            href: getPermalink('contact'),
        }
    ],
    actions: [{ text: 'Get Started', href: getPermalink('/contact'), target: '_self' }],
};

export const footerData = {
    links: [
        {
            title: 'Company',
            links: [
                { text: 'About Us', href: getPermalink('/about') },
                { text: 'Our Services', href: getPermalink('/services') },
                { text: 'Reviews', href: getPermalink('/reviews') },
                { text: 'Pricing', href: getPermalink('/pricing') },
            ],
        },
        {
            title: 'Services',
            links: [
                { text: 'Service 1', href: getPermalink('/services1') },
                { text: 'Service 2', href: getPermalink('/services2') },
                { text: 'Service 3', href: getPermalink('/services3') },
                { text: 'All Services', href: getPermalink('/services') },
            ],
        },
        {
            title: 'Resources',
            links: [
                { text: 'Blog', href: getBlogPermalink() },
                { text: 'Contact', href: getPermalink('/contact') },
                { text: 'Get Started', href: getPermalink('/contact') },
            ],
        },
        {
            title: 'Legal',
            links: [
                { text: 'Privacy Policy', href: getPermalink('/privacy') },
                { text: 'Terms of Service', href: getPermalink('/terms') },
            ],
        },
    ],
    secondaryLinks: [
        { text: 'Terms', href: getPermalink('/terms') },
        { text: 'Privacy Policy', href: getPermalink('/privacy') },
    ],
    socialLinks: [
        { ariaLabel: 'X', icon: 'tabler:brand-x', href: '#' },
        { ariaLabel: 'Instagram', icon: 'tabler:brand-instagram', href: '#' },
        { ariaLabel: 'Facebook', icon: 'tabler:brand-facebook', href: '#' },
    ],
    footNote: `
    © ${new Date().getFullYear()} Your Business Name. All rights reserved.
  `,
};
