// ref: https://github.com/atlassian/react-beautiful-dnd/blob/master/stories/src/reorder.js
export default function reorder(list, startIndex, endIndex) {
  let result = Array.from(list)
  let [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}
