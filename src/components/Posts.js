import { useTable } from 'react-table'
import React, { useEffect, useState } from 'react'
import Header from './Header'

const Table = () => {
    const [data, setData] = useState([])

    useEffect(() => {
        fetch('/.netlify/functions/getPosts')
        .then(response => response.json())
        .then(data => 
            setData(data.data.slice().map(item => {
              var temp = Object.assign({}, item);
              temp.location = temp.location.join(",");
              temp.isLost = temp.isLost ? "Lost":"Found";
              return temp;
            })))
    }, [])

      const columns = React.useMemo(
            () => [
                {
                    Header: 'Name',
                    accessor: 'name',
                },
                {
                    Header: 'Description',
                    accessor: 'desc',
                },
                {
                    Header: 'Location',
                    accessor: 'location',
                },
                {
                    Header: 'Type',
                    accessor: 'isLost',
                },
                {
                    Header: 'Contact',
                    accessor: 'contact',
                },
            ],
            []
        )
    
    const tableInstance = useTable({ columns, data })
     
     const {
       getTableProps,
       getTableBodyProps,
       headerGroups,
       rows,
       prepareRow,
     } = tableInstance
     
     return (
       <div>
         <Header />
        <table {...getTableProps()}>
          <thead>
            {// Loop over the header rows
            headerGroups.map(headerGroup => (
              // Apply the header row props
              <tr {...headerGroup.getHeaderGroupProps()}>
                {// Loop over the headers in each row
                headerGroup.headers.map(column => (
                  // Apply the header cell props
                  <th {...column.getHeaderProps()}>
                    {// Render the header
                    column.render('Header')}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          {/* Apply the table body props */}
          <tbody {...getTableBodyProps()}>
            {// Loop over the table rows
            rows.map(row => {
              // Prepare the row for display
              prepareRow(row)
              return (
                // Apply the row props
                <tr {...row.getRowProps()}>
                  {// Loop over the rows cells
                  row.cells.map(cell => {
                    // Apply the cell props
                    return (
                      <td {...cell.getCellProps()}>
                        {// Render the cell contents
                        cell.render('Cell')}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
       </div>
     )    
}   


export default Table;