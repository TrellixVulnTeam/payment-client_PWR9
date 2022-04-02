import { getListOfButton, getRangeOfButton } from './utils'

export const useRangeAndList = ({
  currentOfPage,
  totalOfPage,
  displayOfButton,
}) => {
  const rangeOfButton = getRangeOfButton(
    currentOfPage,
    totalOfPage,
    displayOfButton,
  )

  const listOfButton = getListOfButton(rangeOfButton)

  return {
    list: listOfButton,
    range: rangeOfButton,
  }
}
