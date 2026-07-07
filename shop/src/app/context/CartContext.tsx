import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'

import axios from 'axios'

export interface Product {
  id: number
  name: string
  price: number
  promotion?: number
  final_price?: number
  image: string
  description: string

  category: {
    id?: number
    name?: string
  }

  rating: number
  stock: number
}

export interface CartItem
  extends Product {
  quantity: number
}

interface CartContextType {
  cart: CartItem[]

  addToCart: (
    product: Product,
    quantity?: number
  ) => boolean

  removeFromCart: (
    productId: number
  ) => Promise<void>

  updateQuantity: (
    productId: number,
    quantity: number
  ) => Promise<void>

  clearCart: () => void

  checkCartByBranch: (
    branchId: string
  ) => Promise<boolean>

  getTotalPrice: () => number

  getTotalItems: () => number
}

const CartContext =
  createContext<
    CartContextType | undefined
  >(undefined)

export function CartProvider({
  children,
}: {
  children: ReactNode
}) {
  const [cart, setCart] =
    useState<CartItem[]>([])

  const getCartKey = () => {
    const userString =
      localStorage.getItem('user')

    if (!userString) {
      return 'cart_guest'
    }

    try {
      const user =
        JSON.parse(userString)

      if (!user?.id) {
        return 'cart_guest'
      }

      return `cart_user_${user.id}`
    } catch (error) {
      console.error(
        'Lỗi đọc user:',
        error
      )

      return 'cart_guest'
    }
  }

  const loadCart = () => {
    const cartKey =
      getCartKey()

    const savedCart =
      localStorage.getItem(
        cartKey
      )

    if (!savedCart) {
      setCart([])

      return
    }

    try {
      setCart(
        JSON.parse(savedCart)
      )
    } catch (error) {
      console.error(
        'Lỗi đọc giỏ hàng:',
        error
      )

      localStorage.removeItem(
        cartKey
      )

      setCart([])
    }
  }

  useEffect(() => {
    loadCart()
  }, [])

  useEffect(() => {
    const cartKey =
      getCartKey()

    localStorage.setItem(
      cartKey,
      JSON.stringify(cart)
    )
  }, [cart])

  useEffect(() => {
    const handleUserChanged = () => {
      loadCart()
    }

    window.addEventListener(
      'user-changed',
      handleUserChanged
    )

    return () => {
      window.removeEventListener(
        'user-changed',
        handleUserChanged
      )
    }
  }, [])

  const checkCartByBranch = async (
    branchId: string
  ): Promise<boolean> => {
    if (!branchId) {
      return true
    }

    if (cart.length === 0) {
      return true
    }

    try {
      const res = await axios.get(
        'http://127.0.0.1:8000/api/products',
        {
          params: {
            branch_id: branchId,
          },
        }
      )

      const branchProducts =
        res.data.data || []

      const unavailableProducts =
        cart.filter((cartItem) => {
          const product =
            branchProducts.find(
              (p: any) =>
                Number(p.id) ===
                Number(cartItem.id)
            )

          if (!product) {
            return true
          }

          if (
            Number(product.stock) <= 0
          ) {
            return true
          }

          return false
        })

      if (
        unavailableProducts.length ===
        0
      ) {
        return true
      }

      const productNames =
        unavailableProducts
          .map(
            (product) =>
              `• ${product.name}`
          )
          .join('\n')

      const confirmDelete =
        window.confirm(
          `Các sản phẩm sau không có tại chi nhánh này:\n\n` +
          `${productNames}\n\n` +
          `Bạn có muốn xóa các sản phẩm này khỏi giỏ hàng và chuyển chi nhánh không?`
        )

      if (!confirmDelete) {
        return false
      }

      const unavailableIds =
        unavailableProducts.map(
          (product) =>
            Number(product.id)
        )

      setCart((prevCart) =>
        prevCart.filter(
          (item) =>
            !unavailableIds.includes(
              Number(item.id)
            )
        )
      )

      return true
    } catch (error) {
      console.error(
        'Lỗi kiểm tra giỏ hàng:',
        error
      )

      window.alert(
        'Không thể kiểm tra sản phẩm tại chi nhánh này.'
      )

      return false
    }
  }

  const addToCart = (
    product: Product,
    quantity: number = 1
  ): boolean => {
    if (
      Number(product.stock) <= 0
    ) {
      window.alert(
        `${product.name} hiện không có tại chi nhánh này.`
      )

      return false
    }

    if (
      quantity >
      Number(product.stock)
    ) {
      window.alert(
        `${product.name} chỉ còn ${product.stock} sản phẩm tại chi nhánh này.`
      )

      return false
    }

    setCart((prevCart) => {
      const existing =
        prevCart.find(
          (item) =>
            item.id === product.id
        )

      if (existing) {
        const newQuantity =
          existing.quantity +
          quantity

        if (
          newQuantity >
          Number(product.stock)
        ) {
          window.alert(
            `${product.name} chỉ còn ${product.stock} sản phẩm tại chi nhánh này.`
          )

          return prevCart
        }

        return prevCart.map(
          (item) =>
            item.id === product.id
              ? {
                  ...item,
                  ...product,
                  quantity:
                    newQuantity,
                }
              : item
        )
      }

      return [
        ...prevCart,
        {
          ...product,
          quantity,
        },
      ]
    })

    return true
  }

  const removeFromCart = async (
    productId: number
  ) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) =>
          item.id !== productId
      )
    )
  }

  const updateQuantity = async (
    productId: number,
    quantity: number
  ) => {
    if (quantity <= 0) {
      await removeFromCart(
        productId
      )

      return
    }

    setCart((prevCart) =>
      prevCart.map((item) => {
        if (
          item.id !== productId
        ) {
          return item
        }

        if (
          quantity >
          Number(item.stock)
        ) {
          window.alert(
            `${item.name} chỉ còn ${item.stock} sản phẩm tại chi nhánh này.`
          )

          return item
        }

        return {
          ...item,
          quantity,
        }
      })
    )
  }

  const clearCart = () => {
    const cartKey =
      getCartKey()

    setCart([])

    localStorage.removeItem(
      cartKey
    )
  }

  const getTotalPrice = () => {
    return cart.reduce(
      (total, item) => {
        const price =
          item.final_price ??
          item.price

        return (
          total +
          Number(price) *
            item.quantity
        )
      },
      0
    )
  }

  const getTotalItems = () => {
    return cart.reduce(
      (total, item) =>
        total +
        item.quantity,
      0
    )
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        checkCartByBranch,
        getTotalPrice,
        getTotalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context =
    useContext(CartContext)

  if (!context) {
    throw new Error(
      'useCart must be used within a CartProvider'
    )
  }

  return context
}