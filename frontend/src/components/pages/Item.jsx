// Páginas
import styles from './Item.module.css'
import Container from '../layout/Container'
import ItemForm from '../item/ItemForm'
// Bibliotecas
import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
const backendUrl = import.meta.env.VITE_BACKEND_URL

function Item() {

    const { id } = useParams()
    const [item, setItem] = useState([])
    const [itemForm, setItemForm] = useState(false)
    const navigate = useNavigate()

    // Mostrar Card
    useEffect(() => {
        const fetchData = async () => {
            try {
                const resp = await fetch(`${backendUrl}/itens/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })

                const data = await resp.json()
                const imageUrl = `${backendUrl}${data.image}`

                setItem({
                    ...data,
                    imageUrl: imageUrl,
                })
            } catch (error) {
                console.error('Erro ao carregar item:', error)
            }
        }

        fetchData()
    }, [id])

    // Editar Card
    function editCard(item) {
        const formData = new FormData()

        // Atribuindo os valores com o formData
        formData.append('name', item.name)
        formData.append('budget', item.budget)
        formData.append('desc', item.desc)
        formData.append('categoryId', item.categoryId)
        formData.append('image', item.image)

        fetch(`${backendUrl}/itens/${item.id}`, {
            method: 'PATCH',
            body: formData,
        })
            .then((resp) => resp.json())
            .then((data) => {
                setItem(data)
                setItemForm(!itemForm)
                const state = { message: "Item atualizado com sucesso!" }
                navigate('/stock', { state })
            })
            .catch(error => {
                console.error("Erro ao editar o item:", error)
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
                            {item.imageName && (
                                <img
                                    src={item.imageUrl}
                                    alt="Imagem carregada"
                                    className={styles.itemImage}
                                />
                            )}
                            <div className={styles.infoContainer}>
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