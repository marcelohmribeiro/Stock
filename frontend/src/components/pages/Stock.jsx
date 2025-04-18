// Páginas
import styles from './Stock.module.css'
import LinkButton from '../layout/LinkButton'
import Container from '../layout/Container'
import ItemCard from '../item/ItemCard'
import Loading from '../layout/Loading'
// Bibliotecas
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'

function Stock() {
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [itens, setItens] = useState([])
    const [loading, setLoading] = useState(true)
    // Mostrar Cards
    useEffect(() => {
        fetch(`${backendUrl}/itens`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((resp) => resp.json())
            .then((data) => {
                setItens(data)
                setLoading(false)
            })
            .catch((err) => console.log(err))
    }, [])
    // Excluir Item
    function removeItem(id) {
        const token = localStorage.getItem("token")
        fetch(`${backendUrl}/itens/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        })
            .then((resp) => resp.json())
            .then(() => {
                setItens(itens.filter((item) => item.id !== id))
                toast.success("Item excluído com sucesso!")
            })
            .catch((err) => console.log(err))
    }
    if (loading) return (
        <Loading txt="Carregando..." />
    )
    return (
        <div className={styles.item_container}>
            <div className={styles.title_container}>
                <h1>Meus Produtos</h1>
                {itens.length > 0 && <p>Produtos cadastrados: <span>{itens.length}</span></p>}
                <LinkButton to="/newitem" text="Criar Item" />
            </div>
            <Container customClass="start">
                {itens.length > 0 &&
                    itens.map((item) => (
                        <ItemCard
                            name={item.name}
                            id={item.id}
                            budget={item.budget}
                            category={item.category?.name}
                            key={item.id}
                            desc={item.desc}
                            handleRemove={removeItem}
                        />))}
                {itens.length === 0 &&
                    <p>Não há nenhum produto cadastrado.</p>
                }
            </Container>
        </div>
    )
}

export default Stock