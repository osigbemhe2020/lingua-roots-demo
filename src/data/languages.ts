export interface LanguageOption {
    id: string;
    name: string;
    greeting: string;
    iconType: 'ionicons' | 'feather' | 'material';
    iconName: string;
}

export const LANGUAGES: LanguageOption[] = [
    {
        id: 'sw',
        name: 'Swahili',
        greeting: 'Jambo',
        iconType: 'ionicons',
        iconName: 'globe-outline',
    },
    {
        id: 'yo',
        name: 'Yoruba',
        greeting: 'Bawo ni',
        iconType: 'material',
        iconName: 'translate',
    },
    {
        id: 'ha',
        name: 'Hausa',
        greeting: 'Sannu',
        iconType: 'ionicons',
        iconName: 'earth-outline',
    },
    {
        id: 'ig',
        name: 'Igbo',
        greeting: 'Ndeewo',
        iconType: 'ionicons',
        iconName: 'chatbubble-outline',
    },
];
