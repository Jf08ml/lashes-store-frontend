import { defineStore } from "pinia";
import { computed } from "vue";

export const useCarStore = defineStore("car", {
  state: () => {
    // Inicializar desde localStorage al crear el estado
    const savedItems = localStorage.getItem("galaxia-cart")
    const savedCustomer = localStorage.getItem("galaxia-customer")

    return {
      items: savedItems ? JSON.parse(savedItems) : [],
      customer: savedCustomer ? JSON.parse(savedCustomer) : {
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        notes: ''
      },
      order: [],
    }
  },

  getters: {
    itemCount: (state) => {
      return state.items.reduce((total, item) => total + (item.quantity || 1), 0)
    },

    subtotal: (state) => {
      return state.items.reduce((total, item) => {
        const price = item.priceUnit || item.price || 0
        const quantity = item.quantity || 1
        return total + (price * quantity)
      }, 0)
    },

    total: (state) => {
      return state.subtotal // Podemos agregar descuentos/envío después
    },

    hasItems: (state) => state.items.length > 0,

    // Preparar datos para la orden
    orderData: (state) => ({
      customer: state.customer,
      items: state.items.map(item => ({
        product: item._id,
        name: item.name,
        sku: item.sku || '',
        quantity: item.quantity || 1,
        unitPrice: item.priceUnit || item.price || 0,
        totalPrice: (item.priceUnit || item.price || 0) * (item.quantity || 1),
        selectedVariant: item.references ? {
          selections: item.references.reduce((acc, ref) => {
            acc[ref.name] = ref.selectedOption
            return acc
          }, {})
        } : null,
        productSnapshot: {
          basePrice: item.basePrice,
          description: item.description,
          image: item.image
        }
      })),
      subtotal: state.subtotal,
      total: state.total,
      paymentMethod: 'cash',
      paymentStatus: 'pending',
      orderType: 'online'
    })
  },

  actions: {
    addItem(item) {
      // Buscar si el item ya existe
      const existingIndex = this.items.findIndex(existingItem => {
        // Comparar por ID del producto
        if (existingItem._id !== item._id) return false

        // Si ambos tienen referencias, compararlas
        if (item.references && existingItem.references) {
          const currentRefs = JSON.stringify(item.references)
          const existingRefs = JSON.stringify(existingItem.references)
          return currentRefs === existingRefs
        }

        // Si ninguno tiene referencias, son el mismo item
        return !item.references && !existingItem.references
      })

      if (existingIndex !== -1) {
        // Incrementar cantidad del item existente
        this.items[existingIndex].quantity = (this.items[existingIndex].quantity || 1) + (item.quantity || 1)
      } else {
        // Agregar nuevo item
        const newItem = {
          ...item,
          quantity: item.quantity || 1,
          addedAt: new Date().toISOString()
        }
        this.items.push(newItem)
      }

      this.saveToLocalStorage()
    },

    addOrder(order) {
      this.order.push({
        ...order,
        orderDate: new Date().toISOString()
      })
    },

    removeItem(index) {
      if (index >= 0 && index < this.items.length) {
        this.items.splice(index, 1)
        this.saveToLocalStorage()
      }
    },

    updateQuantity(index, quantity) {
      if (index >= 0 && index < this.items.length) {
        if (quantity <= 0) {
          this.removeItem(index)
        } else {
          this.items[index].quantity = quantity
          this.saveToLocalStorage()
        }
      }
    },

    setCustomer(customerData) {
      this.customer = { ...this.customer, ...customerData }
      localStorage.setItem("galaxia-customer", JSON.stringify(this.customer))
    },

    clearCart() {
      this.items = []
      this.order = []
      this.customer = {
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        notes: ''
      }
      localStorage.removeItem("galaxia-cart")
      localStorage.removeItem("galaxia-customer")
    },

    saveToLocalStorage() {
      try {
        const dataToSave = JSON.stringify(this.items)
        localStorage.setItem("galaxia-cart", dataToSave)
      } catch (error) {
        // Handle error silently
      }
    },

    loadFromLocalStorage() {
      try {
        const savedItems = localStorage.getItem("galaxia-cart")
        const savedCustomer = localStorage.getItem("galaxia-customer")

        if (savedItems) {
          this.items = JSON.parse(savedItems)
        }

        if (savedCustomer) {
          this.customer = JSON.parse(savedCustomer)
        }
      } catch (error) {
        this.items = []
        this.customer = {
          name: '',
          email: '',
          phone: '',
          address: '',
          city: '',
          notes: ''
        }
      }
    }
  },
});
