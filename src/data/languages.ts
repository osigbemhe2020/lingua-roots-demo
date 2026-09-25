export interface LanguageOption {
    id: string;
    name: string;
    greeting: string;
    iconType: 'ionicons' | 'feather' | 'material';
    iconName: string;
}

export const LANGUAGES: LanguageOption[] = [
    {
        id: 'swahili',
        name: 'Swahili',
        greeting: 'Jambo',
        iconType: 'ionicons',
        iconName: 'globe-outline',
    },
    {
        id: 'yoruba',
        name: 'Yoruba',
        greeting: 'Bawo ni',
        iconType: 'material',
        iconName: 'translate',
    },
    {
        id: 'hausa',
        name: 'Hausa',
        greeting: 'Sannu',
        iconType: 'ionicons',
        iconName: 'earth-outline',
    },
    {
        id: 'igbo',
        name: 'Igbo',
        greeting: 'Ndeewo',
        iconType: 'ionicons',
        iconName: 'chatbubble-outline',
    },
];
