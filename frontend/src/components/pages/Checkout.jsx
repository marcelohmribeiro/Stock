import styles from "./Checkout.module.css"
import Input from "../form/Input"
import Select from "../form/Select"
// Bibliotecas
import { useState, useEffect, useRef } from "react"
import { CgMathMinus, CgMathPlus } from "react-icons/cg";
import { FaRegTrashCan } from "react-icons/fa6";
import { GiBroom } from "react-icons/gi";
import { useAuth } from "../context/AuthContext";
import { toast } from 'react-toastify'
import Loading from "../layout/Loading";

function Checkout() {
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const { user } = useAuth()
    const [item, setItem] = useState([])
    const [filteredItens, setFilteredItens] = useState([])
    const [search, setSearch] = useState("")
    const [isFocused, setIsFocused] = useState(false)
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem("cart")
        return savedCart ? JSON.parse(savedCart) : []
    })
    const [discount, setDiscount] = useState(0)
    const [selectedOption, setSelectedOption] = useState({})
    const [selectedParcelas, setSelectedParcelas] = useState(0)
    const [barcode, setBarcode] = useState("")
    const [submitting, setSubmitting] = useState(false)
    const [loading, setLoading] = useState(false)
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
    // OBS: prevCart representa o estado do carrinho antes da atualização
    // Adiciona o item ao carrinho
    function addCart(itemCart) {
        setCart((prevCart) => {
            const itemExists = prevCart.some((item) => item.id === itemCart.id)
            if (itemExists) {
                console.log("Item já está no carrinho: ", itemCart.name)
                return prevCart
            }
            console.log("Adicionando item:", itemCart.name)
            return [...prevCart, { ...itemCart, quantity: 1 }]
        })
    }
    // Remove o item do carrinho
    function removeItem(itemId) {
        setCart((prevCart) => {
            return prevCart.filter((item) => item.id !== itemId)
        })
    }
    // Atualiza a quantidade do item no carrinho
    function updateQuantity(itemId, newQuantity) {
        if (newQuantity < 1 || isNaN(newQuantity)) {
            return
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
    // Leitor codigo de barras
    function handleBarcodeScan() {
        const foundItem = item.find((i) => i.id.toString() === barcode || i.barcode === barcode)
        if (foundItem) {
            const itemNoCarrinho = cart.find((c) => c.id === foundItem.id)
            if (itemNoCarrinho) {
                // Se já estiver no carrinho, aumenta a quantidade
                const updatedCart = cart.map((c) => c.id === foundItem.id ? { ...c, quantity: c.quantity + 1 } : c)
                setCart(updatedCart)
                toast.info(`Quantidade de ${foundItem.name.toUpperCase()} aumentada`)
            } else {
                addCart(foundItem)
                toast.success(`${foundItem.name.toUpperCase()} adicionado ao carrinho`)
            }
        } else {
            toast.error("Produto não encontrado!")
        }
        setBarcode("")
        inputRef.current?.focus()
    }
    // Leitor codigo de barras
    const inputRef = useRef(null)
    useEffect(() => {
        inputRef.current?.focus()
        const handleGlobalBlur = () => {
            setTimeout(() => {
                const active = document.activeElement
                const isFormField = active.tagName === "INPUT" || active.tagName === "TEXTAREA" || active.tagName === "SELECT"
                if (!isFormField) {
                    inputRef.current?.focus()
                }
            }, 300)
        }
        window.addEventListener("blur", handleGlobalBlur, true)
        return () => {
            window.removeEventListener("blur", handleGlobalBlur, true)
        }
    }, [])
    // Finalizar Pedido
    async function sendCart() {
        if (cart.length <= 0) {
            return toast.error("O carrinho está vazio!")
        } else if (!selectedOption.id) {
            return toast.warning("Selecione uma forma de pagamento!")
        }
        setSubmitting(true)
        setLoading(true)
        const User = user?.name
        const total = cart.reduce((sum, item) => sum + (item.budget * item.quantity), 0) - parseFloat(discount).toFixed(2)
        const payment_method = selectedOption.name
        const parcelas = selectedParcelas
        // Percorrendo o carrinho
        const itens = cart.map(item => ({
            product_id: item.id,
            quantity: item.quantity,
            budget: item.budget,
            item_name: item.name
        }))
        // Finalizando pedido
        try {
            const response = await fetch(`${backendUrl}/createOrder`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user: User, itens, total, payment_method, parcelas })
            })
            const data = await response.json()
            toast.success('Pedido enviado com sucesso!')
            setCart([])
            console.log(data)
        } catch (err) {
            console.error('Erro ao enviar pedido:', err)
            toast.error('Erro ao enviar pedido!')
        } finally {
            setSubmitting(false)
            setLoading(false)
        }
    }
    if (loading) return (
        <Loading txt="Enviando..."/>
    )
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
                {/* input para leitor de codigo de barras */}
                <input
                    ref={inputRef}
                    type="text"
                    className={styles.bcInput}
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault()
                            handleBarcodeScan()
                        }
                    }}
                />
                {isFocused && filteredItens.length > 0 && (
                    <div className={styles.item_container}>
                        {filteredItens.map((item) => (
                            <ul className={styles.item_list} key={item.id}>
                                <div className={styles.item_info}>
                                    <img src={item.image || "https://www.arktus.com.br/images/image-404.png"} />
                                    <div className={styles.item_details}>
                                        <li><span>{item.name.toUpperCase()}</span></li>
                                        <li>{item.desc}</li>
                                        <button
                                            className={styles.btn}
                                            type="button"
                                            onMouseDown={() => addCart(item)}>
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

            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    sendCart()
                }}
                className={styles.cart_main}>
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
                                        handleOnChange={(e) => {
                                            const selectedParcela = parcelas.find(p => p.id === e.target.value)
                                            setSelectedParcelas(selectedParcela ? selectedParcela.name.split('x')[0] : 0)
                                        }}
                                        options={parcelas}
                                        value={selectedParcelas ? selectedParcelas : ""}
                                    />
                                )}
                            </div>
                            {discount > 0 && (
                                <div>
                                    <span>Desconto</span>
                                    <span>R$ -{discount}</span>
                                </div>
                            )}
                            <hr />
                            <div className={styles.cart_totalPrice}>
                                <span>Total</span>
                                <span>R$ {(cartTotal() - discount).toFixed(2)}</span>
                            </div>
                            <button className={styles.btn} type="submit" disabled={submitting}>Finalizar Pedido</button>
                            <button className={styles.clear} onClick={() => setCart([])}>Limpar carrinho <GiBroom /></button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    )
}

export default Checkout
