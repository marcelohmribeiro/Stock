import styles from './Select.module.css'

function Select({ text, name, options, handleOnChange, value }) {
    return (
        <div className={styles.form_config}>
            <label htmlFor={name}>{text}</label>
            <select
                name={name}
                id={name}
                onChange={handleOnChange}
                value={value}
                required
            >
                <option value=''>Selecione uma opção</option>
                {options.map((options) => (
                    <option value={options.id} key={options.id}>
                        {options.name}
                    </option>
                ))}
            </select>
        </div>
    )
}

export default Select