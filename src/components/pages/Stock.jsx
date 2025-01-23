// Páginas
import styles from './Stock.module.css'
import Message from "../layout/Message"
import LinkButton from '../layout/LinkButton'
import Container from '../layout/Container'
import ItemCard from '../item/ItemCard'
// Bibliotecas
import { useLocation } from "react-router-dom"
import { useState, useEffect } from 'react'


function Stock() {

    const [itens, setItens] = useState([])
    const [itemMessage, setItemMessage] = useState('')

    const location = useLocation()
    let message = ''
    if (location.state) {
        message = location.state.message
    }

    // Show Cards
    useEffect(() => {
        fetch('http://localhost:5000/itens', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((resp) => resp.json())
            .then((data) => {
                setItens(data)
            })
            .catch((err) => console.log(err))
    }, [])

    // Excluir Item
    function removeItem(id) {
        fetch(`http://localhost:5000/itens/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((resp) => resp.json())
            .then(() => {
                setItens(itens.filter((item) => item.id !== id))
                setItemMessage('Item excluído com sucesso!')
            })
            .catch((err) => console.log(err))
    }

    return (
        <div className={styles.item_container}>
            <div className={styles.title_container}>
                <h1>Meus Itens</h1>
                {itens.length > 0 && <p>Produtos cadastrados: <span>{itens.length}</span></p>}
                <LinkButton to="/newitem" text="Criar Item" />
            </div>
            {message && <Message type="success" msg={message} />}
            {itemMessage && <Message type="success" msg={itemMessage} />}
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