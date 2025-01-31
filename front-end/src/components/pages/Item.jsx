// Páginas
import styles from './Item.module.css'
import Container from '../layout/Container'
import ItemForm from '../item/ItemForm'
// Bibliotecas
import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

function Item() {

    const { id } = useParams()
    const [item, setItem] = useState([])
    const [itemForm, setItemForm] = useState(false)
    const navigate = useNavigate()

    // Show Card
    useEffect(() => {
        fetch(`http://localhost:8081/itens/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((resp) => resp.json())
            .then((data) => {
                setItem(data)
            })
    }, [id])

    // Edit Card
    function editCard(item) {
        fetch(`http://localhost:8081/itens/${item.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(item),
        })
            .then((resp) => resp.json())
            .then((data) => {
                setItem(data)
                setItemForm(!itemForm)
                const state = { message: "Item atualizado com sucesso!" }
                navigate('/stock', { state })
            })
    }

    // Editar e Fechar
    function item_form() {
        setItemForm(!itemForm)
    }

    return (
        <div className={styles.item_details}>
            <Container customClass="column">
                <div className={styles.details_container}>
                    <h1><span className={styles.spn}>Produto:</span> {String(item.name).toUpperCase()}</h1>
                    <button onClick={item_form} className={styles.btn}>
                        {!itemForm ? 'Editar Item' : 'Fechar'}
                    </button>
                    {!itemForm ? (
                        <div className={styles.form}>
                            <p>
                                <span>Categoria: </span> {item.category?.name}
                            </p>
                            <p>
                                <span>Valor: </span> R${parseFloat(item.budget).toFixed(2)}
                            </p>
                            <p>
                                <span>Descrição: </span> {item.desc}
                            </p>
                        </div>
                    ) : (
                        <div className={styles.form}>
                            <ItemForm
                                handleSubmit={editCard}
                                btnText="Concluir Edição"
                                itemData={item}
                            />
                        </div>
                    )}
                </div>
            </Container>
        </div>
    )
}

export default Item