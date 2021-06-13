export interface ThemeProps {
    [theme: string]: {
        gray: string,
        blue: string,
        blueDark: string,
        green: string,
        red: string,
        textPrimary: string,
        textSecundary: string,
        textUnfocus: string,
        backgroundPrimary: string,
        backgroundSecundary: string,
        backgroundTertiary: string,
    };
}

const lightTheme = {
    gray: '#C3C9CE',
    blue: '#4985F9',
    blueDark: '#0055ff',
    green: '#00D95A',
    red: '#FF0000',

    textPrimary: '#495057',
    textSecundary: '#F8F9FA',
    textUnfocus: '#C3C9CE',

    backgroundPrimary: '#F8F9FA',
    backgroundSecundary: '#E9ECEF',
    backgroundTertiary: '#FFFFFF',
};

const darkTheme = {
    gray: '#575E65',
    blue: '#4985F9',
    blueDark: '#0055ff',
    green: '#00D95A',
    red: '#FF0000',

    textPrimary: '#F8F9FA',
    textSecundary: '#F8F9FA',
    textUnfocus: '#C3C9CE',

    backgroundPrimary: '#40474D',
    backgroundSecundary: '#495057',
    backgroundTertiary: '#495057',
};

export default { light: lightTheme, dark: darkTheme } as ThemeProps;