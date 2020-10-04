import React, { Component } from "react";

const CartContext = React.createContext();

export default class CartProvider extends Component {
  state = {
    cart: [],
    itemQnt: 0,
    vat: 0.1,
    shipping: 15,
    subTotal: 0,
  };
  componentDidMount() {
    //get data in local storage
    let cart = this.state.cart;
    let localCart = localStorage.getItem("cart");
    this.getData(cart, localCart);
  }
  componentDidUpdate(prevProps, prevState) {
    console.log(prevState.cart !== this.state.cart);
    if (prevState.cart !== this.state.cart) {
      this.countTotal();
    }
  }

  //handle cart quantity input
  handleInputChange = (event) => {
    this.setState({ itemQnt: event.target.value });
  };
  //get data from local
  getData = (cart, localCart) => {
    if (localCart !== null) {
      cart = JSON.parse(localCart);
    } else {
      cart = [];
    }
    this.setState({
      cart,
    });
  };

  //count total products cost in cart
  countTotal = () => {
    let cart = this.state.cart;
    let total = 0;
    cart.map((item) => {
      total += item.quantity * item.price;
      return total;
    });
    console.log(total);
    this.setState({ subTotal: total });
  };

  //add  to cart
  addToCart = (item) => {
    let { itemQnt, cart } = this.state;
    let tempCart = [...cart];
    if (!cart.find((product) => item.id === product.id)) {
      tempCart.push(item);
      item.quantity = parseInt(itemQnt);
    } else {
      item.quantity += parseInt(itemQnt);
    }
    localStorage.setItem("cart", JSON.stringify(tempCart));
    this.setState({
      cart: tempCart,
    });
  };

  //increase & decrease cart quantity
  increase = (item) => {
    let { cart } = this.state;
    let tempCart = [...cart];
    let tempItem = tempCart.find((tempItem) => tempItem === item);
    tempItem.quantity += 1;
    this.setState({
      cart: tempCart,
    });
    localStorage.setItem("cart", JSON.stringify(cart));
  };

  decrease = (item) => {
    let { cart } = this.state;
    let tempCart = [...cart];
    let tempItem = tempCart.find((tempItem) => tempItem === item);
    tempItem.quantity -= 1;
    this.setState({
      cart: tempCart,
    });
    localStorage.setItem("cart", JSON.stringify(cart));
  };

  render() {
    return (
      <CartContext.Provider
        value={{
          ...this.state,
          handleInputChange: this.handleInputChange,
          addToCart: this.addToCart,
          increase: this.increase,
          decrease: this.decrease,
          countTotal: this.countTotal,
        }}
      >
        {this.props.children}
      </CartContext.Provider>
    );
  }
}
const CartConsumer = CartContext.Consumer;
export { CartContext, CartProvider, CartConsumer };
