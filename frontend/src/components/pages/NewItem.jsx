// Páginas
import styles from "./NewItem.module.css"
import ItemForm from "../item/ItemForm"
// Bibliotecas
import { useNavigate } from 'react-router-dom'

function NewItem() {
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const navigate = useNavigate()

    function createPost(item) {
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
                console.log("Item criado:", data)
                navigate('/stock', { state: { message: "Item criado com sucesso!" } })
            })
            .catch((err) => console.error(err))
    }

    return (
        <div className={styles.newitem_container}>
            <h1>Criar Item</h1>
            <p>Preencha o formulário abaixo</p>
            <ItemForm handleSubmit={createPost} btnText="Criar Item" />
        </div>
    )
}

export default NewItem