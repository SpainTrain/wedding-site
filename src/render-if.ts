import React from 'react'

type ElementThunk = () => React.ReactElement

/**
 * Render a component conditionally
 *
 * @param predicate predicate to evaluate
 * @returns React Element
 */
// eslint-disable-next-line react/display-name
export const renderIf = (predicate: boolean) => (elemThunk: ElementThunk) =>
  predicate ? elemThunk() : null
