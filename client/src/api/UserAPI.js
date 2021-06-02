import { useState, useEffect } from "react"
import axios from "axios"
// import { set } from "mongoose"

function UserAPI(token) {
  const [isLogged, setIsLogged] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [cart, setCart] = useState([])
  const [history, setHistory] = useState([])

  // get user/infor isLogged then res cart - cart to serCart
  useEffect(() => {
    if (token) {
      const getUser = async () => {
        try {
          const res = await axios.get("/user/infor", {
            headers: { Authorization: token },
          })

          setIsLogged(true)

          res.data.role === 1 ? setIsAdmin(true) : setIsAdmin(false)

          setCart(res.data.cart)
        } catch (err) {
          alert(err.response.data.msg)
        }
      }

      getUser()
    }
  }, [token])

  // add Product to cart of user
  const addCart = async (product) => {
    if (!isLogged) return alert("Please login to continue buying")

    // loại tất cả cái nào ko check giữ lại cái đã chọn
    const check = cart.every((item) => {
      return item._id !== product._id
    })

    // nếu có chọn set cart product đó and quantity
    if (check) {
      setCart([...cart, { ...product, quantity: 1 }])

      await axios.patch(
        "/user/addcart",
        {
          cart: [...cart, { ...product, quantity: 1 }],
        },
        { headers: { Authorization: token } }
      )
    } else {
      alert("This product has been added to cart")
    }
  }

  return {
    isLogged: [isLogged, setIsLogged],
    isAdmin: [isAdmin, setIsAdmin],
    cart: [cart, setCart],
    addCart: addCart,
    history: [history, setHistory],
  }
}

export default UserAPI
