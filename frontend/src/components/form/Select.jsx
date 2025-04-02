import styles from './Select.module.css'

function Select({ textLabel, textOption, name, options, handleOnChange, value }) {
    return (
        <div className={styles.form_config}>
            <label htmlFor={name}>{textLabel}</label>
            <select
                name={name}
                id={name}
                onChange={handleOnChange}
                value={value}
                required
            >
                <option value=''>{textOption}</option>
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