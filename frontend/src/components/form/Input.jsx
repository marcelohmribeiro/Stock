import styles from './Input.module.css'

function Input({ type, text, name, placeholder, handleOnChange, handleOnFocus, handleOnBlur, value }) {
    return (
        <div className={styles.form_config}>
            <label htmlFor={name}>{text}</label>
            <input
                type={type}
                name={name}
                id={name}
                placeholder={placeholder}
                onChange={handleOnChange}
                value={value}
                onFocus={handleOnFocus}
                onBlur={handleOnBlur}
                required
                autoComplete='off'
                maxLength={70}
            />
        </div>
    )
}

export default Input