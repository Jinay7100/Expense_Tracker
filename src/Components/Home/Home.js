import React, { useEffect, useState } from 'react'
import './Home.css'
import ExpenseTable from '../ExpenseTable/ExpenseTable'
import Axios from '../../utils/axios'

const Home = () => {
    const [expense, setExpense] = React.useState({
        Date: "",
        quantity: "",
        Category: "",
        add_money: ""
    })

    const [data, setData] = useState()
    const [updateData, setUpdateData] = useState({
        Date: "",
        quantity: "",
        Category: "",
        add_money: ""
    })

    const deleteExpense = async (id) => {
        try {
            const res = await Axios.post(`expense_delete/${id}`)
            let temp = data.findIndex(i => i.id == id)
            setData([...data.slice(0, temp), ...data.slice(temp + 1)])
        } catch (e) {
            console.log(e.message)
        }
    }

    const getExpense = async () => {
        try {
            const res = await Axios.get("get_expense/")
            setData(res.data)
        } catch (e) {
            console.log(e.message)
        }
    }

    useEffect(() => {
        getExpense()
    }, [])


    const addExpense = async (e) => {
        try {
            const res = await Axios.post("addmoney_submission/", (expense))
            if (res.status == 200) {
                document.getElementById("modal-close").click();
                setData([...data, expense])
                setExpense({
                    Date: "",
                    quantity: "",
                    Category: "",
                    add_money: ""
                })
            }
        } catch (e) {
            console.log(e.message)
        }
    }


    return (
        <div className='container'>
            <h1>
                Expense tracker
            </h1>
            <div className="card mt-5">
                <div className="row px-3 py-2">
                    <div className="d-flex justify-content-between">
                        <div className="">
                            <h3>
                                My wallet
                            </h3>
                            <p>
                                Add Expense or money
                            </p>
                        </div>
                        <div className="">
                            <button className='btn btn-success' data-bs-toggle="modal" data-bs-target="#exampleModal">
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <ExpenseTable
                {...{ data, setData, getExpense, deleteExpense }}

            />
            <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" id='modal-close' aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="flexRadioDefault" value='Expense' id="flexRadioDefault1" onClick={(e) => { setExpense({ ...expense, add_money: e.target.value }) }} />
                                <label class="form-check-label" for="flexRadioDefault1">
                                    Expense
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" value='Money' onClick={(e) => { setExpense({ ...expense, add_money: e.target.value }) }} />
                                <label class="form-check-label" for="flexRadioDefault2">
                                    Money
                                </label>
                            </div>

                            <input type="text" className='w-100 form-control login-fields' placeholder='Amount' value={expense.quantity} onChange={(e) => { setExpense({ ...expense, quantity: e.target.value }) }} />
                            <input type="date" className='w-100 form-control login-fields' placeholder='Date' value={expense.Date} onChange={(e) => { setExpense({ ...expense, Date: e.target.value }) }} />
                            <select class="form-select" aria-label="Default select example" id='category' onChange={(e) => { setExpense({ ...expense, Category: e.target.value }) }}>
                                <option selected value="">Select</option>
                                <option value="Food">Food</option>
                                <option value="Travel">Travel</option>
                                <option value="Shopping">Shopping</option>
                                <option value="Necessities">Necessities</option>
                                <option value="Entertainment">Entertainment</option>
                                <option value="Other">Other</option>
                            </select>
                            <button className='btn btn-success' onClick={() => addExpense()}>Add</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home
