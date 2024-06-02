import React, { useEffect, useState } from 'react'
import './ExpenseTable.css'
import Axios from '../../utils/axios'


const ExpenseTable = ({ data, setData, deleteExpense, getExpense }) => {
    const [selectedRow, setSelectedRow] = useState()


    const handleUpdate = () => {
        setSelectedRow(null)
    }

    const handleChange = (e) => {

    }

    var srno = 1
    return (
        <div className='container mt-5'>
            {/* table to show expenses  */}
            {data && data.length > 0 ?
                <table className='table border table-dark table-hover'>
                    <thead>
                        <tr>
                            <th>Sr No</th>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Category</th>
                            <th colSpan={2}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>

                        {data && data.map((item, idx) => {
                            return (
                                <tr className={item.add_money === 'Expense' ? 'table-danger' : 'table-success'} >
                                    <td>{srno++}</td>
                                    {selectedRow == idx ?
                                        <>
                                            <td>
                                                <input type="date" value={item.Date} />
                                            </td>
                                            {/* <td>{item.Date}</td> */}
                                            <td>
                                                <input type="text" name="" id="" defaultValue={item.quantity} onChange={(e) => { setData([...data.map(i => { if (i.id == item.id) i.quantity = e.target.value; return i; })]) }} />
                                            </td>
                                            <td>
                                                <input type="text" name="" id="" value={item.Category} onChange={(e) => { setData([...data.map(i => { if (i.id == item.id) i.quantity = e.target.value; return i; })]) }} />
                                            </td>
                                            {/* <td>{item.quantity}</td>
                                            <td>{item.Category}</td> */}
                                        </>
                                        :
                                        <>
                                            <td>{item.Date}</td>
                                            <td>{item.quantity}</td>
                                            <td>{item.Category}</td>
                                        </>}
                                    <td>
                                        {selectedRow == idx ?
                                            <button className='btn btn-primary' onClick={() => { handleUpdate() }}>
                                                Update
                                            </button>
                                            :
                                            <button className='btn btn-primary' onClick={() => { setSelectedRow(idx) }}>
                                                Edit
                                            </button>}
                                    </td>
                                    <td>
                                        <button className='btn btn-danger' value={item.id} onClick={(e) => { deleteExpense(e.target.value) }}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>

                            )
                        })}
                    </tbody>
                </table> : ""}
        </div>
    )
}

export default ExpenseTable
