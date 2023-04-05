import React, { useState } from 'react'
import { FC, ReactNode } from 'react'

import {
    HStack,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
    VStack,
} from '@chakra-ui/react'
import { Asset } from 'types/blockchain'

import ValidatorList from "components/ValidatorInput/ValidatorList";
import SearchInput from "components/AssetInput/SearchInput";
import ValidatorSearchInput from "components/ValidatorInput/ValidatorSearchInput";

interface ValidatorSelectModalProps {
    children: ReactNode
    currentValidator: string,
    validatorList: string[],
    onChange: (asset: Asset, isTokenChange?: boolean) => void
    disabled: boolean
    amount?: number
}

const ValidatorSelectModal: FC<ValidatorSelectModalProps> = ({
                                                         children,
                                                         onChange,
                                                         currentValidator = [],
                                                         validatorList = [],
                                                         disabled,
                                                         amount,
                                                     }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [search, setSearch] = useState<string>('')

    const onAssetChange = (asset, isTokenChange) => {
        setSearch(asset?.asset)
        const newAsset = { ...asset, amount }
        onChange(newAsset, isTokenChange)
        onClose()
    }

    return (
        <>
            <HStack
                tabIndex={0}
                role="button"
                onClick={() => !disabled && onOpen()}
                justifyContent="space-between"
                width={['full', 'fit-content']}
            >
                {children}
            </HStack>

            <Modal
                onClose={onClose}
                isOpen={isOpen}
                isCentered
                size={{ base: 'full', md: '2xl' }}
            >
                <ModalOverlay />
                <ModalContent backgroundColor="#212121">
                    <ModalHeader>Validator</ModalHeader>
                    <ModalBody
                        as={VStack}
                        gap={3}
                        paddingX="unset"
                        alignItems="flex-start"
                    >
                        <ValidatorSearchInput onChange={setSearch} />
                        <ValidatorList
                            amount={amount}
                            onChange={onAssetChange}
                            search={search}
                            validatorList={[]}
                            currentValidator={""}
                        />
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}

export default ValidatorSelectModal
