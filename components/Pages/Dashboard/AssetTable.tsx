import {Box, HStack, Image, Text, VStack} from '@chakra-ui/react';
import {
    ColumnDef,
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import React, { useState } from 'react';
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/router';
import {useRecoilValue} from "recoil";
import {walletState} from "state/walletState";
import {useAssetsData} from "components/Pages/Dashboard/hooks/useAssetsData";

type TableProps = {
    logo: string
    symbol: string
    totalStaked: number
    totalValueStaked: number
    takeRate: number
    rewardWeight: number
    additionalAPY: number
}

const columnHelper = createColumnHelper<TableProps>();

const columns: ColumnDef<TableProps, any>[] = [
    columnHelper.accessor('logo', {
        header: () => null,
        cell: (info) => (
            <Image
                src={info.getValue()}
                alt="logo-small"
                width="auto"
                maxW="1.5rem"
                maxH="1.5rem"
            />
        ),
    }),
    columnHelper.accessor('symbol', {
        header: () => (
            <Text
                as="span"
                color="brand.50"
                flex={1}
                fontSize="sm"
                textTransform="capitalize">
                Symbol
            </Text>
        ),
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('totalStaked', {
        enableSorting: true,
        header: () => (
            <Text
                as="span"
                color="brand.50"
                minW="200px"
                fontSize="sm"
                textTransform="capitalize"
            >
                Total Staked
            </Text>
        ),
        cell: (info) => info.getValue() + '%',
    }),
    columnHelper.accessor('totalValueStaked', {
        enableSorting: true,
        header: () => (
            <Text
                as="span"
                color="brand.50"
                minW="200px"
                fontSize="sm"
                textTransform="capitalize"
            >
                Total Value Staked
            </Text>
        ),
        cell: (info) => '$' + info.getValue(),
    }),
    columnHelper.accessor('takeRate', {
        enableSorting: true,
        header: () => (
            <Text
                as="span"
                color="brand.50"
                flex={1}
                fontSize="sm"
                textTransform="capitalize">
                Take Rate
            </Text>
        ),
        cell: (info) => info.getValue() + '%' ,
    }),
    columnHelper.accessor('rewardWeight', {
        enableSorting: true,
        header: () => (
            <Text
                as="span"
                color="brand.50"
                flex={1}
                fontSize="sm"
                textTransform="capitalize">
                Reward Weight
            </Text>
        ),
        cell: (info) => info.getValue() + '%' ,
    }),
    columnHelper.accessor('additionalAPY', {
        enableSorting: true,
        header: () => (
            <Text
                as="span"
                color="brand.50"
                flex={1}
                fontSize="sm"
                textTransform="capitalize">
                Additional APY
            </Text>
        ),
        cell: (info) => info.getValue() + '%',
    }),
]

const AssetTable = () => {
    const { address } = useRecoilValue(walletState)
    const [sorting, setSorting] = useState<any>([
        {
            desc: false,
            id: 'status',
        },
    ]);
    const router = useRouter();

    const { data: assets} = useAssetsData()

    const table = useReactTable({
        data: dataRows,
        columns,
        state: {
            sorting,
            columnVisibility: {
                duration: true,
                value: true,
                weight: true,
                action: true,
                status: false,
            },
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });


    return (
        <VStack width="full" minW="800px" overflowX="auto">
            {table.getHeaderGroups()?.map((headerGroup) => (
                <HStack
                    key={headerGroup.id}
                    width="full"
                    py="4"
                    px="8"
                    position="relative"
                >
                    {headerGroup.headers.map((header, index) => (
                        <Box
                            key={header.id}
                            flex={index == 0 || index == 3 ? 1 : 'unset'}
                            minW={index == 1 || index == 2 ? '200px' : 'unset'}
                            cursor={header.column.getCanSort() ? 'pointer' : 'default'}
                            onClick={header.column.getToggleSortingHandler()}
                        >
                            <HStack>
                                <Box>
                                    {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext(),
                                    )}
                                </Box>
                                {header?.column?.columnDef?.enableSorting && (
                                    <VStack width="fit-content" p="0" m="0" spacing="0">
                                        <TriangleUpIcon
                                            fontSize="8px"
                                            color={
                                                header.column.getIsSorted() == 'asc' ? 'white' : 'gray'
                                            }
                                        />
                                        <TriangleDownIcon
                                            fontSize="8px"
                                            color={
                                                header.column.getIsSorted() === 'desc'
                                                    ? 'white'
                                                    : 'gray'
                                            }
                                        />
                                    </VStack>
                                )}
                            </HStack>
                        </Box>
                    ))}
                </HStack>
            ))}
            {table.getRowModel().rows?.map((row) => (
                <HStack
                    key={row.id}
                    width="full"
                    borderRadius="30px"
                    backgroundColor="rgba(0, 0, 0, 0.5)"
                    py="5"
                    px="8"
                >
                    {row.getVisibleCells().map((cell, index) => {
                        return (
                            <Text
                                key={cell.id}
                                as={index == 3 ? HStack : 'span'}
                                flex={index == 0 || index == 3 ? 1 : 'unset'}
                                minW={index == 1 || index == 2 ? '200px' : 'unset'}
                            >
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </Text>
                        );
                    })}
                </HStack>
            ))}
            {!tableData?.length && (
                <Text color="brand.50" fontSize="sm" textTransform="capitalize">
                    No whitelisted assets found
                </Text>
            )}
        </VStack>
    );
};

export default ValidatorTable
