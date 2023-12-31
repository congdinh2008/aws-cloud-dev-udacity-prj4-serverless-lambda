import { Dimmer, Loader } from 'semantic-ui-react'

const Callback = () => {
    return (
        <Dimmer active>
            <Loader content="Loading" />
        </Dimmer>
    )
}

export default Callback
