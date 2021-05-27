import { useTable } from 'react-table'
import React, { useEffect, useState, useContext } from 'react'
import { UserContext } from "./Contexts";
import Header from './Header'
import './Posts.css'

const Table = () => {
    const [data, setData] = useState([]) //columns of table
    const [onlyMyPosts, setOnlyMyPosts] = useState(true); //togglebutton
    const user = useContext(UserContext).userInfo.user;

    const creds = {
      email: user
    }

    const toggleButtonState = () => {
      setOnlyMyPosts(!onlyMyPosts);
    }

    useEffect(() => {
        onlyMyPosts ? fetch('http://localhost:9000/getMyPosts', {
          method: 'POST', 
          body: JSON.stringify(creds)
        })
        .then(response => response.json())
        .then(data => 
            setData(data.data.slice().map(item => {
              var temp = Object.assign({}, item);
              temp.location = temp.location.join(",");
              temp.isLost = temp.isLost ? "Lost":"Found";
              return temp;
            }))) :
        fetch('http://localhost:9000/getPosts')
        .then(response => response.json())
        .then(data => 
            setData(data.data.slice().map(item => {
              var temp = Object.assign({}, item);
              temp.location = temp.location.join(",");
              temp.isLost = temp.isLost ? "Lost":"Found";
              return temp;
            })))
      // eslint-disable-next-line
    }, [onlyMyPosts])

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
                {
                    Header: '',
                    accessor: 'id',
                    id: 'ids'
                }
            ],
            []
        )
    
    const initialState = {
      hiddenColumns: ["ids"]
    }
    
    const tableInstance = useTable({ columns, data, initialState})
     
     const {
       getTableProps,
       getTableBodyProps,
       headerGroups,
       rows,
       prepareRow,
     } = tableInstance
     
     const buttonStateText = onlyMyPosts ? "Show All Posts" : "Show My Posts";

     const deletePost = async (postID) => {
       try{
        const id = {
          id: postID
        }
        await fetch('http://localhost:9000/deletePost', {
        method: 'POST', 
        body: JSON.stringify(id)     
       })
        alert("Successfully deleted post!");
        window.location.reload();
       } catch(err) {
         alert("Error deleting post");
       }             
     }

     return (
       <div>
        <Header />
        <button className="switch" onClick={toggleButtonState}>{buttonStateText}</button>        
          {(data.length === 0 && <h2>You have no entries</h2>) || 
            <table className="table" {...getTableProps()}>
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
                      <td> {onlyMyPosts && <button onClick={() => deletePost(row.values.ids)}>Delete Post</button>}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          }          
        <br></br><br></br><br></br>
       </div>
     )    
}   


export default Table;