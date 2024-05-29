import React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { AccountProvider } from './AccountContext'
import { AuthProvider } from './AuthContext'
import { BerriesProvider } from './BerryContext'
import { DarkModeProvider } from './DarkModeContext'
import { MarketProvider } from './MarketContext'
import { NavigationMenuProvider } from './NavigationMenuContext'
import { NotificationProvider } from './NotificationContext'
import { PokedexProvider } from './PokedexContext'
import { SettingsProvider } from './SettingsContext'
import { TranslationProvider } from './TranslationsContext'

const queryClient = new QueryClient()

export const Providers = ({ children }) => {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <AccountProvider>
                    <NotificationProvider>
                        <TranslationProvider>
                            <SettingsProvider>
                                <DarkModeProvider>
                                    <NavigationMenuProvider>
                                        <PokedexProvider>
                                            <BerriesProvider>
                                                <MarketProvider>
                                                    {children}
                                                </MarketProvider>
                                            </BerriesProvider>
                                        </PokedexProvider>
                                    </NavigationMenuProvider>
                                </DarkModeProvider>
                            </SettingsProvider>
                        </TranslationProvider>
                    </NotificationProvider>
                </AccountProvider>
            </AuthProvider>
        </QueryClientProvider>
    )
}
