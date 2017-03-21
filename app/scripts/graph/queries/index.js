import {graphql} from 'react-apollo'

import ROOMS_QUERY from './roomsQuery.graphql'

export const roomsQuery = graphql(ROOMS_QUERY, {})
