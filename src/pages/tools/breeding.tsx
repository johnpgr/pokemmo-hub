import React from 'react'
import { Information } from '../../components/Information'
import { Page } from '../../components/Page'
import { PageTitle } from '../../components/PageTitle'
import { Seo } from '../../components/SEO'
import { useTranslations } from '../../context/TranslationsContext'
import { PokemonBreedSelect } from "@/components/Breeding/PokemonBreedSelect"
import { PokemonBreedTree } from "@/components/Breeding/PokemonBreedTree"
import { BreedTreeContext } from "@/components/Breeding/core/ctx/PokemonBreedTreeContext"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as ToasterSonner } from "@/components/ui/sonner"
import "../../global-tw.css"

const Breeding = ({ pageContext }: any) => {
    const { t } = useTranslations()
    const PAGE_TITLE = "Breeding simulator"

    return (
        <Page breadcrumbs={pageContext.breadcrumb} label={PAGE_TITLE}>
            <Toaster />
            <ToasterSonner />
            <PageTitle>{t(PAGE_TITLE)}</PageTitle>
            <BreedTreeContext>
                <Information title={t("How to use the breeding tool")}>
                    {t("breedingToolExplanationModal")}
                </Information>
                <PokemonBreedSelect />
                <PokemonBreedTree />
            </BreedTreeContext>
        </Page>
    )
}

export default Breeding

const description = "A guide for breeding in PokeMMO. The calculator will show you a pattern easy to follow. Select how many IVs do you need and enjoy the solution."
export const Head = () => <Seo title="Breeding Guide Simulator" description={description}></Seo>
