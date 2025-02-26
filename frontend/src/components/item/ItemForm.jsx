// Páginas
import styles from './ItemForm.module.css'
import Input from '../form/Input'
import Select from '../form/Select'
import SubmitButton from '../form/SubmitButton'
import Upload from '../form/Upload'
// Bibliotecas
import { useState, useEffect } from 'react'

function ItemForm({ handleSubmit, itemData, btnText }) {
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [categories, setCategories] = useState([])
    const [item, setItem] = useState(itemData || {})
    const [submitting, setSubmitting] = useState(false)

    // Pegando as categorias existentes no DataBase
    useEffect(() => {
        fetch(`${backendUrl}/categories`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((resp) => resp.json())
            .then((data) => {
                setCategories(data)
            })
    }, [])


    const submit = (e) => {
        e.preventDefault()
        setSubmitting(true)
        handleSubmit(item)
    }

    // Desestruturando os dados
    function handleChange(e) {
        setItem({ ...item, [e.target.name]: e.target.value })
    }

    function handleCategory(e) {
        const selectedCategoryId = e.target.value // igualando os ID
        setItem({
            ...item,
            categoryId: selectedCategoryId,
            category: {
                id: e.target.value,
                name: e.target.options[e.target.selectedIndex].text,
            },
        })
    }

    function handleImage(file) {
        setItem({ ...item, image: file })
    }

    return (
        <form onSubmit={submit} className={styles.form}>
            <Input
                type="text"
                text="Nome do produto"
                name="name"
                placeholder="Insira o nome do produto"
                handleOnChange={handleChange}
                value={item.name ? item.name : ''}
            />
            <Input
                type="number"
                text="Valor do produto"
                name="budget"
                placeholder="Insira o valor do produto"
                handleOnChange={handleChange}
                value={item.budget ? item.budget : ''}
            />
            <Input
                type="text"
                text="Especificações do produto"
                name="desc"
                placeholder="Detalhes do produto"
                handleOnChange={handleChange}
                value={item.desc ? item.desc : ''}
            />
            <Select
                name="category_id"
                text="Selecione a categoria"
                options={categories}
                handleOnChange={handleCategory}
                value={item.category ? item.categoryId : ''}
            />
            <Upload
                text="Imagem do produto (opcional)"
                handleOnChange={handleImage}
            />
            <SubmitButton text={btnText} disabled={submitting}/>
        </form>
    )
}

export default ItemForm