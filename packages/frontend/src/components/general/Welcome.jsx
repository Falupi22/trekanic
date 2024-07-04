import { Heading } from "@chakra-ui/react"

function Welcome(props) {
    const hour = new Date().getHours()

    let greeting;
    //console.log(hour <= 2)

    if (hour > 21 || hour <= 2) {
        greeting = "Good night, "
    }
    else if (hour > 2 && hour <= 9) {
        greeting = "Good morning, "
    }
    else if (hour > 15 && hour <= 18) {
        greeting = "Good afternoon, "
    }
    else if (hour > 18 && hour <= 21) {
        greeting = "Good evening, "
    }
    else {
        greeting = "Welcome back, "
    }

    greeting += props.userName
    return <Heading fontSize="3xl">
        {greeting}
    </Heading>
}

export default Welcome;