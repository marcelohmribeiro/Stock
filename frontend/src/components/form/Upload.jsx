import styles from './Upload.module.css'
// Bibliotecas
import Dropzone from 'react-dropzone'
import { useState } from 'react'
import { MdCheckCircle, MdError, MdLink } from 'react-icons/md'
import { toast } from 'react-toastify'

function Upload({ handleOnChange, text }) {
    const [fileInfo, setFileInfo] = useState(null)
    const maxFileSize = 2 * 1024 * 1024 // 2MB
    // Upload do arquivo
    const handleUpload = (acceptedFiles) => {
        const selectedFile = acceptedFiles[0]
        if (selectedFile) {
            const isValid = selectedFile.size <= maxFileSize
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
                toast.warn('Arquivo muito grande! O tamanho máximo é de 2MB.')
            }
        }
    }
    // Formatação do tamanho do arquivo
    const formatFileSize = (size) => {
        if (size < 1024) {
            return `${size} bytes`
        } else if (size < 1024 * 1024) {
            return `${(size / 1024).toFixed(2)} KB`
        } else {
            return `${(size / (1024 * 1024)).toFixed(2)} MB`
        }
    }
    // Excluir arquivo
    const removeFile = () => {
        setFileInfo(null)
        handleOnChange(null)
    }
    // Mensagem da caixa de upload
    function renderMessage(isDragActive, isDragReject) {
        if (!isDragActive) {
            return <p>Arraste o arquivo aqui...</p>
        }
        if (isDragReject) {
            return <p className={styles.error}>Arquivo não permitido</p>
        }
        return <p className={styles.success}>Solte o arquivo aqui</p>
    }
    return (
        <div className={styles.container}>
            {!fileInfo && (
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
            {fileInfo && (
                <ul>
                    <li>
                        <div className={styles.fileInfo}>
                            <img className={styles.preview} src={fileInfo.url} />
                            <div>
                                <strong>{fileInfo.name}</strong>
                                <span>
                                    {fileInfo.error && <div className={styles.sizeFalse}>{formatFileSize(fileInfo.size)}</div>}
                                    {fileInfo.uploaded && <div className={styles.sizeCheck}>{formatFileSize(fileInfo.size)}</div>}
                                    <button type='button' onClick={removeFile}>Excluir</button>
                                </span>
                            </div>
                            {fileInfo.url && (
                                <a href={fileInfo.url} target='_blank'>
                                    <MdLink style={{ marginRight: 8 }} size={24} color='#222' />
                                </a>
                            )}
                            {fileInfo.uploaded && <MdCheckCircle size={24} color='#78ed5f' />}
                            {fileInfo.error && <MdError size={24} color='#e57878' />}
                        </div>
                    </li>
                </ul>
            )}
        </div>
    )
}

export default Upload