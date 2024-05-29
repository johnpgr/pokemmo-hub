import { BERRIES_FAVORITES, DEFAULT_ACCOUNT_BERRY } from './berries'

export const DEFAULT_USER_DATA = {
    berries: {
        planted: DEFAULT_ACCOUNT_BERRY,
        favorites: BERRIES_FAVORITES,
    },
    market: {
        investments: [],
        wishlist: [],
    },
    discordId: '',
    language: 'en',
    notifications: [],
    isDark: true,
}

