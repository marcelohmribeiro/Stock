import styles from './DashBoard.module.css'
import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import LinkButton from '../../layout/LinkButton'
import { toast } from 'react-toastify'
import { IoCloseOutline } from "react-icons/io5";

function AdminDashboard() {
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const token = localStorage.getItem("token")
    const { user } = useAuth()
    const navigate = useNavigate()
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [orders, setOrders] = useState([])
    const [openOrder, setOpenOrder] = useState(false)
    const [selectedOrder, setSelectedOrder] = useState(null)
    useEffect(() => {
        if (user && user.role !== 'admin') {
            navigate('/checkout')
        }
    }, [user, navigate])
    // Busca os usuários cadastrados
    useEffect(() => {
        const token = localStorage.getItem("token")
        const fetchUsers = async () => {
            try {
                const res = await fetch(`${backendUrl}/users`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                })
                if (!res.ok) {
                    console.log(`Erro de status: ${res.status}`)
                    throw new Error(`Erro ${res.status}`)
                }
                const data = await res.json()
                setUsers(data)
            } catch (error) {
                console.error('Erro ao buscar usuários', error)
            } finally {
                setLoading(false)
            }
        }
        if (user?.role === 'admin' && token) {
            fetchUsers()
        }
    }, [backendUrl, user])
    // Busca os pedidos
    useEffect(() => {
        if (!user) {
            return
        }
        const fetchOrders = async () => {
            const token = localStorage.getItem("token")
            if (!token) return
            try {
                const res = await fetch(`${backendUrl}/orders`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                })
                if (!res.ok) {
                    return
                }
                const data = await res.json()
                setOrders(data)
            } catch (err) {
                console.error('Erro ao buscar pedidos', err)
            }
        }
        fetchOrders()
        return () => setOrders([])
    }, [backendUrl, user])
    // Deletar usuário
    const handleDeleteUser = async (userId) => {
        if (token) {
            try {
                const res = await fetch(`${backendUrl}/users/${userId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                })
                if (res.ok) {
                    // Atualiza a lista
                    setUsers(users.filter(user => user.id !== userId))
                    toast.success("Usuário excluído com sucesso!")
                } else {
                    console.log('Erro ao excluir usuário', res.status)
                }
            } catch (error) {
                console.error('Erro ao excluir usuário', error)
            }
        }
    }
    // Abrir e fechar pedido
    function handleOpenModal(order) {
        setSelectedOrder(order)
        setOpenOrder(true)
    }
    function handleCloseModal() {
        setOpenOrder(false)
        setSelectedOrder(null)
    }
    const handleDeleteOrder = async (orderId) => {
        try {
            const res = await fetch(`${backendUrl}/orders/${orderId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            })
            if (res.ok) {
                toast.success("Pedido excluído com sucesso!")
                setOrders((prevOrders) => prevOrders.filter(order => order.id !== orderId))
                setOpenOrder(false)
            } else {
                console.error("Erro ao excluir o pedido")
            }
        } catch (err) {
            console.error("Erro ao excluir pedido:", err)
        }
    }
    if (loading) return <p>Carregando usuários...</p>
    return (
        <div className={styles.container_main}>
            <div className={styles.titleContainer}>
                <h1>Painel de Administrador</h1>
                <LinkButton to="/register" text="Cadastrar Usuário" />
            </div>
            <div className={styles.container}>
                <div className={styles.dashboardContainer}>
                    <h1>Usuários</h1>
                    <div className={styles.userList}>
                        {users.map((u) => (
                            <div key={u.id} className={styles.userCard}>
                                <h2>{u.name}</h2>
                                <p className={u.role === 'admin' ? styles.admin : styles.user}>
                                    {u.role === 'admin' ? 'Administrador' : 'Funcionário'}
                                </p>
                                <p><span>Email: </span>{u.email}</p>
                                <p><span>Criado em: </span>{new Date(u.createdAt).toLocaleString()}</p>
                                {u.id !== user.id && (
                                    <button className={styles.btnDelete} onClick={() => handleDeleteUser(u.id)}>Excluir</button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className={styles.checkoutHistory}>
                    <h1>Histórico de Pedidos</h1>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Nº Pedido</th>
                                <th>Funcionário</th>
                                <th>Forma de Pagamento</th>
                                <th>Total</th>
                                <th>Data</th>
                                <th>Propriedades</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.id}>
                                    <td>{order.id}</td>
                                    <td>{order.user}</td>
                                    <td>{order.payment_method}</td>
                                    <td>{order.total}</td>
                                    <td>{new Date(order.data).toLocaleString()}</td>
                                    <td><button onMouseDown={() => handleOpenModal(order)}>Sobre</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {openOrder && (
                <div className={styles.modal_overlay} onClick={handleCloseModal}>
                    <div className={styles.modal_content} onClick={(e) => e.stopPropagation()}>
                        <button className={styles.modal_close} onClick={handleCloseModal}><IoCloseOutline /></button>
                        <h2>Detalhes do Pedido #{selectedOrder.id}</h2>
                        <p><strong>Funcionário: </strong>{selectedOrder.user}</p>
                        <p><strong>Forma de Pagamento: </strong>{selectedOrder.payment_method}</p>
                        {selectedOrder.payment_method === "Cartão de crédito" && (
                            <p><strong>Parcelas: </strong>{selectedOrder.parcelas}x</p>
                        )}
                        <p><strong>Total: </strong>R${selectedOrder.total}</p>
                        <p><strong>Data: </strong>{new Date(selectedOrder.data).toLocaleString()}</p>
                        <ul className={styles.itens_container}>
                            <h2>Itens do Pedido</h2>
                            {selectedOrder.itens && selectedOrder.itens.map((item, index) => (
                                <li key={index}>
                                    <h3><strong>{item.item_name.toUpperCase()}</strong></h3>
                                    <p><strong>Quantidade: </strong>{item.quantity}</p>
                                    <p><strong>Preço Unitário: </strong>R${item.budget}</p>
                                </li>
                            ))}
                            <button onMouseDown={() => handleDeleteOrder(selectedOrder.id)}>Excluir</button>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminDashboard
