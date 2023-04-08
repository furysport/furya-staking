import { HStack, VStack, Button,  Heading } from "@chakra-ui/react"
import { useState } from "react"
import ValidatorTable from "./ValidatorTable"


const Topbar = ({setColumnFilters}) => {
    const [activeButton, setActiveButton] = useState("all")


    return (
        <HStack width="full" justifyContent="space-between">

            <Heading color="white" size="lg">Validators</Heading>


            <HStack
                margin="20px"
                backgroundColor="rgba(0, 0, 0, 0.25)"
                width="auto"
                px="20px"
                py="10px"
                borderRadius="75px"
                gap="20px"
            >
                {
                    ["all", "active", "inactive"].map((item) => (
                        <Button
                            key={item}
                            minW="120px"
                            variant={activeButton === item ? "primary" : "unstyled"}
                            color="white"
                            size="sm"
                            onClick={() => {
                                setActiveButton(item)
                                setColumnFilters(item === "all" ? [] : [{
                                    id: "status",
                                    value: item
                                }])
                            }}
                            textTransform="capitalize"
                        >
                            {item}
                        </Button>
                    ))

                }
            </HStack>

        </HStack>
    )
}

const Validators = ({address}) => {
    const [columnFilters, setColumnFilters] = useState([])
    return (
        <VStack width="full">
            <Topbar setColumnFilters={setColumnFilters} />
            <ValidatorTable columnFilters={columnFilters}  address={address} />
        </VStack>

    )
}

export default Validators