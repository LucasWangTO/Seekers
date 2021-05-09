import { useTable } from 'react-table'
import React, { useEffect, useState } from 'react'

/*
for(let i = 0; i < tableData.length; i++) {
    tableData[i].location = tableData[i].location.join(",");
}*/
const Table = () => {
    const [tableData, setTableData] = useState([])
    useEffect(() => {
        fetch('http://localhost:9000/getPosts')
        .then(response => response.json())
        .then(data => 
            //tableData = data.data.slice())
            console.log(data.data.slice()))
    })
    //console.log(tableData)
        const data = React.useMemo(
            () => [
                tableData
            ],
            []
        )
        const columns = React.useMemo(
            () => [
                {
                    Header: 'Name',
                    accessor: 'col1',
                },
                {
                    Header: 'Description',
                    accessor: 'col2',
                },
                {
                    Header: 'Location',
                    accessor: 'col3',
                },
                {
                    Header: 'isLost',
                    accessor: 'col4',
                },
                {
                    Header: 'Contact',
                    accessor: 'col5',
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
       // apply the table props
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
     )    
}   


export default Table;