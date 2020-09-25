import * as React from 'react'

export const App = (props: { startTime: number }): JSX.Element => {
  return <h1>{`${props.startTime}`}</h1>
}
