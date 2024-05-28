import React from 'react'
import { Information } from '../../components/Information'
import { Page } from '../../components/Page'
import { PageTitle } from '../../components/PageTitle'
import { Seo } from '../../components/SEO'
import { useTranslations } from '../../context/TranslationsContext'
import { PokemonBreedSelect } from "@/components/Breeding/PokemonBreedSelect"
import { PokemonBreedTree } from "@/components/Breeding/PokemonBreedTree"
import { BreedTreeContext } from "@/components/Breeding/core/ctx/PokemonBreedTreeContext"
import pokemons from "@/data/pokemmo/breeding-monster.json"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as ToasterSonner } from "@/components/ui/sonner"

const Breeding = ({ pageContext }: any) => {
    const { t } = useTranslations()
    const PAGE_TITLE = "Breeding simulator"

    return (
        <Page breadcrumbs={pageContext.breadcrumb} label={PAGE_TITLE}>
            {/* @ts-ignore */}
            <PageTitle>{t(PAGE_TITLE)}</PageTitle>
            <BreedTreeContext pokemonSpeciesUnparsed={pokemons}>
                <Information title={t("How to use the breeding tool")}>
                    {t("breedingToolExplanationModal")}
                </Information>
                <PokemonBreedSelect />
                <PokemonBreedTree />
            </BreedTreeContext>
            <Toaster />
            <ToasterSonner />
        </Page>
    )
}

export default Breeding


const description = "A guide for breeding in PokeMMO. The calculator will show you a pattern easy to follow. Select how many IVs do you need and enjoy the solution."
//@ts-ignore
export const Head = () => <Seo title="Breeding Guide Simulator" description={description}></Seo>
