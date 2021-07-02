import productModal from './productModal.js'

const url = "https://vue3-course-api.hexschool.io"
const path = "uy_neish"

const app = Vue.createApp({
  data() {
    return {
      loadingStatus: {
        loadingItem: '',
      },
      products: [],
      product: {},
      form: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: ''
        },
        message: ''
      },
      cart: {}
    }
  },
  methods: {
    getProducts () {
      const api = `${url}/api/${path}/products`
      axios.get(api)
        .then(res => {
          console.log(res)
          this.products = res.data.products
        })
        .catch(err => console.log(err))
    },
    openModal (item) {
      this.loadingStatus.loadingItem = item.id
      console.log(item)
      this.$refs.userProductModal.openModal()
      const api = `${url}/api/${path}/product/${item.id}`
      axios.get(api)
        .then(res => {
          console.log(res)
          this.loadingStatus.loadingItem = ''
          this.product = res.data.product
          // this.$refs.userProductModal.openModal()
        })
        .catch(err => console.log(err))
    },
    addCart (id, qty=1) {
      this.loadingStatus.loadingItem = id
      const cart = {
        product_id: id,
        qty
      }
      console.log(cart)
      const api = `${url}/api/${path}/cart`
      axios.post(api, {data: cart})
        .then(res => {
          this.loadingStatus.loadingItem = ''
          console.log(res)
          this.$refs.userProductModal.hideModal()
          this.getCart()
          alert('已新增至購物車')
        })
        .catch(err => console.log(err))
    },
    getCart () {
      const api = `${url}/api/${path}/cart`
      axios.get(api)
        .then(res => {
          this.cart = res.data.data
        })
        .catch(err => console.log(err))
    },
    updateCart (item) {
      this.loadingStatus.loadingItem = item.id
      const api = `${url}/api/${path}/cart/${item.id}`
      const cart = {
        product_id: item.product.id,
        qty: item.qty
      }
      console.log(cart, api)
      axios.put(api, {data: cart})
        .then(res => {
          this.loadingStatus.loadingItem = ''
          this.cart = res.data.data
          console.log()
          this.getCart()
        })
        .catch(err => console.log(err))
    },
    deleteCart (item) {
      this.loadingStatus.loadingItem = item.id
      const api = `${url}/api/${path}/cart/${item.id}`
      axios.delete(api)
        .then(res => {
          console.log(res)
          this.loadingStatus.loadingItem = ''
          this.getCart()
        })
        .catch(err => console.log(err))
    },
    deleteAll () {
      const api = `${url}/api/${path}/carts`
      axios.delete(api)
        .then(res => {
          console.log(res)
          this.getCart()
        })
        .catch(err => console.log(err))
    },
    isPhone (value) {
      const phoneNumber = /^(09)[0-9]{8}$/
      return phoneNumber.test(value) ? true : '需為09開頭且為10碼數字'
    },
    onSubmit () {
      console.log(this.form)
      const api = `${url}/api/${path}/order`
      axios.post(api, { data: this.form})
        .then(res => {
          if(res.data.success){
            console.log(res)
            this.getCart()
            this.$refs.form.resetForm()
            alert('已送出訂單')
          }
        })
        .catch(err => console.log(err))
    }
  },
  mounted () {
    this.getProducts()
    this.getCart()
    // this.$refs.userProductModal.openModal()
  }
})

VeeValidate.defineRule('email', VeeValidateRules['email']);
VeeValidate.defineRule('required', VeeValidateRules['required']);
VeeValidateI18n.loadLocaleFromURL('./zh_TW.json');

// Activate the locale
VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize('zh_TW'),
  validateOnInput: true, // 調整為輸入字元立即進行驗證
})

Object.keys(VeeValidateRules).forEach(rule => {
  if (rule !== 'default') {
    VeeValidate.defineRule(rule, VeeValidateRules[rule]);
  }
})

app.component('VForm', VeeValidate.Form)
app.component('VField', VeeValidate.Field)
app.component('ErrorMessage', VeeValidate.ErrorMessage)

app.component('userProductModal', productModal)
app.mount('#app')