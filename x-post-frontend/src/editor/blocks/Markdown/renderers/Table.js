import React from 'react'
import { Table as SUITable } from 'semantic-ui-react'

let Table = ({ children }) => (
  <SUITable celled>
    {children}
  </SUITable>
)
let TableHeader = ({ children }) => (
  <SUITable.Header>
    {children}
  </SUITable.Header>
)
let TableBody = ({ children }) => (
  <SUITable.Body>
    {children}
  </SUITable.Body>
)
let TableRow = ({ children }) => (
  <SUITable.Row>
    {children}
  </SUITable.Row>
)
let TableCell = ({ isHeader, children }) => {
  if (!isHeader) {
    return (
      <SUITable.Cell>
        {children}
      </SUITable.Cell>
    )
  }
  return (
    <SUITable.HeaderCell>
      {children}
    </SUITable.HeaderCell>
  )
}

Table.Header = TableHeader
Table.Body = TableBody
Table.Row = TableRow
Table.Cell = TableCell

export default Table
