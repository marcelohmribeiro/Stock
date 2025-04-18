// Páginas
import styles from "./NewItem.module.css"
import ItemForm from "../item/ItemForm"
import Loading from "../layout/Loading"
// Bibliotecas
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useState } from "react"

function NewItem() {
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    function createPost(item) {
        setLoading(true)
        const formData = new FormData()
        // Atribuindo os valores com o formData
        formData.append("name", item.name)
        formData.append("budget", item.budget)
        formData.append("desc", item.desc)
        formData.append("categoryId", item.categoryId)
        formData.append("image", item.image)
        // Criando o Item
        fetch(`${backendUrl}/itens`, {
            method: 'POST',
            body: formData,
        })
            .then((resp) => resp.json())
            .then((data) => {
                navigate('/stock', toast.success("Item criado com sucesso!"))
                setLoading(false)
            })
            .catch((err) => console.error(err))
    }
    if (loading) return (
        <Loading txt="Enviando..." />
    )
    return (
        <div className={styles.newitem_container}>
            <h1>Criar Item</h1>
            <p>Preencha o formulário abaixo</p>
            <ItemForm handleSubmit={createPost} btnText="Criar Item" />
        </div>
    )
}

export default NewItem