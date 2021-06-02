import React, { useContext, useEffect } from "react"
import { GlobalState } from "../../../GlobalState"
import { Link } from "react-router-dom"
import axios from "axios"

function OrderHistory() {
  const state = useContext(GlobalState)
  const [history, setHistory] = state.userAPI.history
  const [isAdmin] = state.userAPI.isAdmin
  const [token] = state.token
  // const [callback] = useState(false)

  //get and set history from res.data
  useEffect(() => {
    if (token) {
      const getHistory = async () => {
        if (isAdmin) {
          const res = await axios.get("/api/payment", {
            headers: { Authorization: token },
          })
          setHistory(res.data)
        } else {
          const res = await axios.get("/user/history", {
            headers: { Authorization: token },
          })
          setHistory(res.data)
        }
      }
      getHistory()
    }
  }, [token, isAdmin, setHistory])

  return (
    <div>
      <h2>History</h2>

      <h4>You have {history.length} ordered</h4>

      <div className="history-page">
        <table>
          <thead>
            <tr>
              <th>Payment ID</th>
              <th>Date of Purchased</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {history.map((item) => (
              <tr key={item.id}>
                <td key={item.paymentID}>{item.paymentID}</td>
                <td key={item.createdAt}>
                  {new Date(item.createdAt).toLocaleDateString()}
                </td>
                <td>
                  <Link to={`/history/${item._id}`}> View </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default OrderHistory
