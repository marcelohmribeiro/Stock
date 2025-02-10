import styles from './Upload.module.css'
import Message from '../layout/Message'
// Bibliotecas
import Dropzone from 'react-dropzone'
import { useState } from 'react'
import { MdCheckCircle, MdError, MdLink } from 'react-icons/md'

function Upload({ handleOnChange, text }) {

    const [file, setFile] = useState(null)
    const [fileInfo, setFileInfo] = useState(null)
    const [fileMessage, setFileMessage] = useState('')

    const handleUpload = (acceptedFiles) => {
        const maxFileSize = 2 * 1024 * 1024
        const selectedFile = acceptedFiles[0]

        if (selectedFile) {
            const isValid = selectedFile.size <= maxFileSize

            setFile(selectedFile)
            setFileInfo({
                name: selectedFile.name,
                size: selectedFile.size,
                uploaded: isValid,
                error: !isValid,
                url: URL.createObjectURL(selectedFile)
            })

            if (isValid) {
                handleOnChange(selectedFile) // Passando o file para o componente pai  
            } else {
                setFileMessage('Arquivo não suportado!')
            }
        }
    }

    // formatação do tamanho do arquivo
    const formatFileSize = (size) => {
        if (size < 1024) {
            return `${size} bytes`
        } else if (size < 1024 * 1024) {
            return `${(size / 1024).toFixed(2)} KB`
        } else {
            return `${(size / (1024 * 1024)).toFixed(2)} MB`
        }
    }

    const removeFile = () => {
        setFile(null)
        setFileInfo(null)
        setFileMessage('')
    }

    function renderMessage(isDragActive, isDragReject) {
        if (!isDragActive) {
            return <p>Arraste o arquivo aqui...</p>
        }
        if (isDragReject) {
            return <p className={styles.error}>Arquivo não suportado</p>
        }
        return <p className={styles.success}>Solte o arquivo aqui</p>
    }

    return (
        <div className={styles.container}>
            {!file && (
                <Dropzone onDrop={handleUpload} accept={{ 'image/*': [] }} >
                    {({ getRootProps, getInputProps, isDragActive, isDragReject }) => (
                        <div
                            className={styles.dropzone}
                            {...getRootProps()}
                        >
                            <label>{text}</label>
                            <input
                                {...getInputProps()}
                            />
                            {renderMessage(isDragActive, isDragReject)}
                        </div>
                    )}
                </Dropzone>
            )}
            {file && (
                <ul>
                    <li>
                        <div className={styles.fileInfo}>
                            <img className={styles.preview} src={fileInfo.url} />
                            <div>
                                <strong>{fileInfo.name}</strong>
                                <span>{formatFileSize(fileInfo.size)}<button type='button' onClick={removeFile}>Excluir</button></span>
                            </div>
                            {fileInfo.url && (
                                <a href={fileInfo.url} target='_blank'>
                                    <MdLink style={{ marginRight: 8 }} size={24} color='#222' />
                                </a>
                            )}
                            {fileInfo.uploaded && <MdCheckCircle size={24} color='#78ed5f' />}
                            {fileMessage && (
                                <div className={styles.message}>
                                    <Message type="error" msg={fileMessage} />
                                </div>
                            )}
                            {fileInfo.error && <MdError size={24} color='#e57878' />}
                        </div>
                    </li>
                </ul>
            )}
        </div>

    )
}

export default Upload