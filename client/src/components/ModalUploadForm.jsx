import { useState } from "react"

const ModalUploadForm = ({ field, value, text, onSave, onClose }) => {
    const [inputValue, setInputValue] = useState(value)

    const handleSave = () => {
        onSave(inputValue)
        onClose()
    }

    const jsxml =
        <div className="profile-modal-backdrop">
            <div className="profile-modal">
                <h2 className="profile-modal-title">Update {text}</h2>

                <div className="input-container">
                    <input
                        key={field}
                        type={field == 'email' ? 'email' : 'text'}
                        className='inputForm'
                        placeholder={`Insert your ${text}`}

                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                    />
                </div>

                <div className="profile-modal-actions">
                    <button onClick={onClose} className="profile-btn-secondary">Cancel</button>
                    <button onClick={handleSave} className="profile-btn-primary">Accept</button>
                </div>
            </div>
        </div>

    return jsxml
}

export default ModalUploadForm