'use client'

import { useEffect, useState } from 'react'
import ProductList from './ProductList'

function FilterProduct() {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchProducts() {
      try {
        setIsLoading(true)
        const res = await fetch('https://dummyjson.com/products?limit=100')
        const data = await res.json()
        setProducts(data.products)
      } catch (error) {
        console.error('Error fetching products:', error)
        setProducts([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return (
    <ProductList products={products} isLoading={isLoading} />
  )
}

export default FilterProduct