import { useState } from "react"
import { useForm } from 'react-hook-form'
import { FaEye } from "react-icons/fa"
import { FaEyeSlash } from "react-icons/fa";

import { useAuth } from '../context/auth/AuthContext'

const PassUploadForm = ({ userId, password, onClose }) => {
    const [currentPasswordValue, setCurrentPasswordValue] = useState('')
    const [newPasswordValue, setNewPasswordValue] = useState('')
    const [mostrarPassword, setMostrarPassword] = useState(false);
    const { updatePass, errors: passErrors, responseOkPass } = useAuth()
    const { register, setFocus, formState: { errors } } = useForm()

    const handleSave = async () => {
        const passData = { currentPass: currentPasswordValue, newPass: newPasswordValue }
        updatePass(passData)
    }

    // Función para alternar el estado
    const togglePassword = (e) => {
        e.preventDefault()
        setMostrarPassword(!mostrarPassword);
        setFocus('password')
    }

    const jsxml =
        <div className="profile-modal-backdrop">
            <div className="profile-modal">
                <h2 className="profile-modal-title">Update Password</h2>
                {
                    passErrors?.map((error, i) => (
                        <div className='authErrors' key={i}>
                            {error}
                        </div>
                    ))
                }
                {
                    responseOkPass &&
                    <div className='authErrors' style={{ backgroundColor: "green" }}>
                        {responseOkPass}
                    </div>
                }
                <div className="flex input-container mt-4">
                    <input
                        type={mostrarPassword ? "text" : "password"}
                        className='inputForm'
                        placeholder='Current Password'
                        onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                        {...register("currentPassword", { required: true })}

                        value={currentPasswordValue}
                        onChange={(e) => setCurrentPasswordValue(e.target.value)}
                    />
                    <label htmlFor="currentPassword">Current Password{errors.password && <span className='input-error'> : Current password is required</span>}</label>
                    <button
                        onClick={togglePassword}
                        className="eyeButton">{mostrarPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>
                <div className="flex input-container pr-7">
                    <input
                        type={mostrarPassword ? "text" : "password"}
                        className='inputForm'
                        placeholder='New Password'
                        onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                        {...register("newPassword", { required: true })}

                        value={newPasswordValue}
                        onChange={(e) => setNewPasswordValue(e.target.value)}
                    />
                    <label htmlFor="newPassword">New Password{errors.password && <span className='input-error'> : New password is required</span>}</label>
                </div>

                <div className="profile-modal-actions pt-2">
                    <button onClick={onClose} className="profile-btn-secondary">Close</button>
                    <button onClick={handleSave} className="profile-btn-primary">Change Password</button>
                </div>
            </div>
        </div>

    return jsxml
}

export default PassUploadForm
