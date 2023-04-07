import { Button, Text, HStack, VStack, Box} from '@chakra-ui/react'
import { createColumnHelper, flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable, getPaginationRowModel } from '@tanstack/react-table'
import React, { useMemo, useState } from 'react'
import useValidators from 'hooks/useValidators';
import useDelegations from 'hooks/useDelegations';
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
import {ActionType} from "components/Pages/Delegations/Dashboard";
import {useRouter} from "next/router";

type Props = {
    columnFilters: any;
    address: string

}

type TableProps = {
    name: string;
    votingPower: string;
    commission: string;
    status: string;
    actionButtons: JSX.Element;
}


const columnHelper = createColumnHelper<TableProps>()

const columns = [
    columnHelper.accessor('name', {
        header: () => <Text as="span" color="brand.50" flex={1} fontSize="sm" textTransform="capitalize">Name</Text>,
        cell: (info) => info.getValue(),
        
    }),
    columnHelper.accessor('votingPower', {
        header: () => (<Text as="span" color="brand.50" minW="200px" fontSize="sm" textTransform="capitalize">Voting Power</Text>),
        cell: (info) => info.getValue() + "%",
        

    }),
    columnHelper.accessor('commission', {
        header: () => (<Text as="span" color="brand.50" minW="200px" fontSize="sm" textTransform="capitalize">Commission</Text>),
        cell: (info) => info.getValue() + "%",
        
    }),
    columnHelper.accessor('actionButtons', {
        header: () => (<Text as="span" color="brand.50" flex={1} fontSize="sm" textTransform="capitalize">Action</Text>),
        cell: (info) => info.getValue(),
        

    }),
    columnHelper.accessor('status', {}),

]

const ValidatorTable = ({ columnFilters, address }: Props) => {

    const [sorting, setSorting] = useState<any>([{
        desc: false,
        id: "status"
    }])
    const router = useRouter()

    const { data: { validators = [] } = {} } = useValidators({address})

    const { data: { delegations = [] } = {} } = useDelegations({address})



    const tableData = useMemo(() => {

        if (!validators?.length) return []

        const onClick = async(action: ActionType)=>{
            await router.push(`/${ActionType[action]}`)
        }
        const getIsActive = (validator) => {
            const delegation = delegations.find(({ delegation }) => delegation.validator_address === validator.validator_addr)
            return !!delegation ? "active" : "all"
        }
        return validators?.map((validator) => ({
            name: validator?.description?.moniker,
            votingPower: "0",
            commission: validator.commission,
            status: getIsActive(validator),
            actionButtons:   <HStack spacing={5}>
                <Button variant="outline" size="sm" onClick={()=>onClick(ActionType.delegate)} >Delegate</Button>
                <Button variant="outline" size="sm" onClick={()=>onClick(ActionType.redelegate)}  >Redelegate</Button>
                <Button variant="outline" size="sm" onClick={()=>onClick(ActionType.undelegate)}  >Undelegate</Button>
            </HStack>
        }))

    }, [validators])





    const table = useReactTable({
        data: tableData,
        columns,
        state: {
            sorting,
            columnFilters,
            columnVisibility: {
                duration: true,
                value: true,
                weight: true,
                action: true,
                status: false,
            }
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    })


    // <Tr key={headerGroup.id} >
    // {headerGroup.headers.map((header) => (
    //     <Th
    //         key={header.id} color="brand.50"
    //         cursor={header.column.getCanSort() ? "pointer" : "default"}
    //         onClick={header.column.getToggleSortingHandler()}
    //     >

    return (
        <VStack width="full" minW="800px" overflowX="auto">
            {table.getHeaderGroups().map((headerGroup, index) => (
                <HStack key={headerGroup.id} width="full" py="4" px="8" position="relative">
                    {headerGroup.headers.map((header, index) => (
                        <Box
                            key={header.id}
                            // as={index == 3 ? Box : 'span'}
                            flex={index == 0 || index == 3 ? 1 : 'unset'}
                            minW={index == 1 || index == 2 ? "200px" : 'unset'}
                            cursor={header.column.getCanSort() ? "pointer" : "default"}
                            onClick={header.column.getToggleSortingHandler()}
                            p="0"
                            m="0"
                        >
                            <HStack>
                                <Box>
                                    {
                                        flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )
                                    }
                                </Box>

                                {header?.column?.columnDef?.enableSorting && (
                                    <VStack width="fit-content" p="0" m="0" spacing="0">
                                        <TriangleUpIcon fontSize="8px" color={header.column.getIsSorted() == 'asc' ? "white" : "white"} />
                                        <TriangleDownIcon fontSize="8px" color={header.column.getIsSorted() === 'desc' ? "white" : "gray"} />
                                    </VStack>
                                )}
                            </HStack>

                        </Box>
                    ))}
                </HStack>
            ))}

            {table.getRowModel().rows.map((row, index) => (
                <HStack key={row.id} width="full" borderRadius="30px" backgroundColor="rgba(0, 0, 0, 0.5)" py="5" px="8">
                    {row.getVisibleCells().map((cell, index) => {
                        return (
                            <Text
                                key={cell.id}
                                as={index == 3 ? HStack : 'span'}
                                flex={index == 0 || index == 3 ? 1 : 'unset'}
                                minW={index == 1 || index == 2 ? "200px" : 'unset'}
                            >
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </Text>
                        )
                    })}
                </HStack>
            ))}

            {!tableData?.length && (
                <Text color="brand.50" fontSize="sm" textTransform="capitalize">No validators found</Text>
            )}

            {
                !!tableData?.length && (

                    <HStack w="full" justifyContent="space-between" pt="3" >

                        <Text>
                            Showing {table.getState().pagination.pageIndex + 1} of{' '}
                            {table.getPageCount()} pages
                        </Text>

                        <HStack gap="2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => table.previousPage()}
                                isDisabled={!table.getCanPreviousPage()}
                            > Previous  </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => table.nextPage()}
                                isDisabled={!table.getCanNextPage()}
                            > Next </Button>
                        </HStack>

                    </HStack>

                )
            }


        </VStack>
    )
}

export default ValidatorTable