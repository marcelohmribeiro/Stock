import { useState, useEffect } from "react"
import styles from "./Checkout.module.css"
import Input from "../form/Input"
import { CgMathMinus, CgMathPlus } from "react-icons/cg";
import { FaRegTrashCan } from "react-icons/fa6";
import Select from "../form/Select"
import { GiBroom } from "react-icons/gi";
import SubmitButton from "../form/SubmitButton";

function Checkout() {
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [item, setItem] = useState([])
    const [filteredItens, setFilteredItens] = useState([])
    const [search, setSearch] = useState("")
    const [isFocused, setIsFocused] = useState(false)
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem("cart")
        return savedCart ? JSON.parse(savedCart) : []
    })
    const [descount, setDiscount] = useState(0)
    const [selectedOption, setSelectedOption] = useState({})
    const [selectedParcelas, setSelectedParcelas] = useState(0) // pegando o valor do select de parcelas

    const paymentOptions = [
        { id: "1", name: "Pix" },
        { id: "2", name: "Cartão de debito" },
        { id: "3", name: "Cartão de crédito" },
        { id: "4", name: "Dinheiro" }
    ]

    const parcelas = [
        { id: "1", name: "1x" },
        { id: "2", name: "2x" },
        { id: "3", name: "3x" },
        { id: "4", name: "4x" },
        { id: "5", name: "5x" },
        { id: "6", name: "6x" },
        { id: "7", name: "7x" },
        { id: "8", name: "8x" },
        { id: "9", name: "9x" },
        { id: "10", name: "10x" },
        { id: "11", name: "11x" },
        { id: "12", name: "12x" }
    ]

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart))
    }, [cart])

    // Pega todos os itens do banco
    useEffect(() => {
        fetch(`${backendUrl}/itens`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((resp) => resp.json())
            .then((data) => {
                setItem(data)
            })
            .catch((err) => console.log(err))
    }, [])

    // Filtra os itens com base no que o usuário digita
    useEffect(() => {
        if (search === "") {
            setFilteredItens(item)
        } else {
            const filtered = item.filter((item) =>
                item.name.includes(search)
            )
            setFilteredItens(filtered)
        }
    }, [search, item])

    // Adiciona o item ao carrinho
    function addCart(itemCart) {
        setCart((prevCart) => {
            const itemExists = prevCart.some((item) => item.id === itemCart.id)
            if (itemExists) {
                console.log("Item já está no carrinho: ", itemCart.name)
                return prevCart
            } else {
                const updatedCart = [...prevCart, { ...itemCart, quantity: 1 }]
                localStorage.setItem("cart", JSON.stringify(updatedCart))
                return updatedCart
            }
        })
    }

    // Remove o item do carrinho
    function removeItem(itemId) {
        const itemRemove = cart.filter((item) => item.id !== itemId)
        setCart(itemRemove, localStorage.setItem("cart", JSON.stringify(itemRemove)))
    }

    // Atualiza a quantidade do item no carrinho
    function updateQuantity(itemId, newQuantity) {
        if (newQuantity < 1 || isNaN(newQuantity)) {
            newQuantity = 1
        }
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.id === itemId ? { ...item, quantity: newQuantity } : item
            )
        )
    }

    // Calcula o preço total do item no carrinho
    function totalPrice(itemId) {
        const item = cart.find((item) => item.id === itemId)
        if (!item || item.quantity < 0 || isNaN(item.quantity)) {
            return 0
        } else {
            return (item.budget * item.quantity).toFixed(2)
        }
    }

    // Calcula o preço total do carrinho
    function cartTotal() {
        return cart.reduce((acc, item) => acc + parseFloat(totalPrice(item.id)), 0).toFixed(2)
    }

    // Calcula o desconto com base na forma de pagamento
    function handleSelect(e) {
        const selected = e.target.value
        const paymentMethod = paymentOptions.find((options) => options.id === selected)
        if (paymentMethod) {
            setSelectedOption(paymentMethod)
        } else {
            setSelectedOption({})
        }
    }

    useEffect(() => {
        if (selectedOption.id === "1") {
            setDiscount((0.05 * cartTotal()).toFixed(2))
        } else if (selectedOption.id === "2") {
            setDiscount((0.03 * cartTotal()).toFixed(2))
        } else {
            setDiscount(0)
        }
    }, [selectedOption, cartTotal])

    function clearCart() {
        setCart([], localStorage.removeItem("cart"))
    }

    /*
    function sendCart() {
        if (cart.length === 0) {
            console.log("Erro ao enviar: o carrinho está vazio!")
            return
        } else if (!selectedOption.id) {
            console.log("Erro ao enviar: selecione uma forma de pagamento!")
            return
        } else {

        }
    }
    */

    return (
        <div className={styles.container}>
            <div className={styles.search_container}>
                <Input
                    text="Buscar Produtos"
                    type="text"
                    placeholder="Busque por um produto"
                    value={search}
                    handleOnChange={(e) => setSearch(e.target.value)}
                    handleOnFocus={() => setIsFocused(true)}
                    handleOnBlur={() => setTimeout(() => setIsFocused(false), 100)}
                />
                {isFocused && filteredItens.length > 0 && (
                    <div className={styles.item_container}>
                        {filteredItens.map((item) => (
                            <ul className={styles.item_list} key={item.id}>
                                <div className={styles.item_info}>
                                    <img src={item.image || "https://tetraconind.com.br/wp-content/themes/atom-theme/assets/img/default-img.png"} />
                                    <div className={styles.item_details}>
                                        <li><span>{item.name.toUpperCase()}</span></li>
                                        <li>{item.desc}</li>
                                        <button
                                            className={styles.btn}
                                            type="button"
                                            onClick={() => addCart(item)}>
                                            Adicionar
                                        </button>
                                    </div>
                                </div>
                                <hr />
                            </ul>
                        ))}
                    </div>
                )}
            </div>

            <div className={styles.cart_main}>
                {cart.length > 0 && (
                    <div className={styles.cart_container}>
                        <div className={styles.cart_info}>
                            <span>Produto</span>
                            <div>
                                <span>Quantidade</span>
                                <span>Total</span>
                            </div>
                        </div>
                        {cart.map((item) => (
                            <ul className={styles.item_list} key={item.id}>
                                <hr />
                                <div className={styles.item_info}>
                                    <img src={item.image || "https://www.arktus.com.br/images/image-404.png"} />
                                    <div className={styles.item_details}>
                                        <div>
                                            <li>{item.name.toUpperCase()}</li>
                                            <li><span className={styles.item_budget}>R$ {item.budget}</span></li>
                                        </div>
                                        <div className={styles.item_position}>
                                            <div className={styles.quantity}>
                                                <a onClick={() => updateQuantity(item.id, item.quantity - 1)}><CgMathMinus /></a>
                                                <Input
                                                    type="text"
                                                    value={item.quantity}
                                                    handleOnChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                                                />
                                                <a onClick={() => updateQuantity(item.id, item.quantity + 1)}><CgMathPlus /></a>
                                            </div>
                                            <li><span>R$ {totalPrice(item.id)}</span></li>
                                            <a onClick={() => { removeItem(item.id) }}><FaRegTrashCan /></a>
                                        </div>
                                    </div>
                                </div>
                                <hr />
                            </ul>
                        ))}
                    </div>
                )}

                {cart.length > 0 && (
                    <div className={styles.cart_total}>
                        <h1>Resumo do pedido</h1>
                        <div className={styles.cart_infoPrice}>
                            <div>
                                <span>Subtotal</span>
                                <span>R$ {cartTotal()}</span>
                            </div>
                            <div className={styles.select}>
                                <Select
                                    name="payment"
                                    textLabel="Forma de pagamento"
                                    textOption="Selecione uma opção"
                                    handleOnChange={handleSelect}
                                    options={paymentOptions}
                                    value={paymentOptions ? selectedOption.id : ""}
                                />
                                {selectedOption.id === "3" && (
                                    <Select
                                        name="parcelas"
                                        textLabel="Parcelas"
                                        textOption="0x"
                                        handleOnChange={(e) => setSelectedParcelas(e.target.value)}
                                        options={parcelas}
                                        value={selectedParcelas ? selectedParcelas : ""}
                                    />
                                )}
                            </div>
                            {descount > 0 && (
                                <div>
                                    <span>Desconto</span>
                                    <span>R$ -{descount}</span>
                                </div>
                            )}
                            <hr />
                            <div className={styles.cart_totalPrice}>
                                <span>Total</span>
                                <span>R$ {(cartTotal() - descount).toFixed(2)}</span>
                            </div>
                            <button className={styles.btn}>Finalizar Pedido</button>
                            <button className={styles.clear} onClick={clearCart}>Limpar carrinho <GiBroom /></button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Checkout
