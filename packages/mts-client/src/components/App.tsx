import router from '@shared/lib/config/router'
import { RouterProvider } from 'react-router-dom'

import '@shared/styles/_app.sass'
import '@shared/styles/_fonts.sass'
import '@shared/styles/_mixins.sass'
import '@shared/styles/_reset.sass'
import '@shared/styles/_variables.sass'

const App = () => {
	return <RouterProvider router={router} />
}

export default App
