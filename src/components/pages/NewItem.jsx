// Páginas
import styles from "./NewItem.module.css"
import ItemForm from "../item/ItemForm"
// Bibliotecas
import { useNavigate } from 'react-router-dom'


function NewItem() {

    const navigate = useNavigate()
    
    function createPost(item) {
        fetch('http://localhost:5000/itens', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(item),
        })
            .then((resp) => resp.json())
            .then((data) => {
                console.log(data)
                const state = { message: "Item criado com sucesso!" }
                navigate('/stock', { state })
            })
            .catch((err) => console.log(err))
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