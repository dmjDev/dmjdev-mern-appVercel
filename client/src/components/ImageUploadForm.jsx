import { useForm } from 'react-hook-form'
import { useRef } from 'react';

import { useAuth } from '../context/auth/AuthContext'

const ImageUploadForm = ({ userId, onClose }) => {
    const { progress, isUploading, uploadImage, errors: profileErrors } = useAuth()
    const { register, handleSubmit, watch, formState: { errors } } = useForm()
    const fileInputRef = useRef(null)
    const fileWatcher = watch("image")
    const previewUrl = fileWatcher?.[0]
        ? URL.createObjectURL(fileWatcher[0])
        : null

    const onFileChange = (e) => {
        const file = e.target.files[0]
        if (!file) return

        const formData = new FormData()
        formData.append('file', file)

        // Llamamos a la función del Provider
        uploadImage(formData)
    }

    const handleButtonClick = () => {
        fileInputRef.current.click(); // Disparamos el clic del input oculto, punto de unión entre el input y el botón
    }
    const onSubmit = async (data) => {
        const formData = new FormData()

        formData.append('image', data.image[0])
        formData.append('customName', userId)

        // console.log(data.image[0])
        // console.log(userId)

        uploadImage(formData)
    }

    const jsxml =
        // handleSubmit(onSubmit, (errors) => console.log(errors))
        <form onSubmit={handleSubmit(onSubmit)}> 
            <div className="profile-modal-backdrop">
                <div className="profile-modal" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    padding: '40px'
                }}>
                    <h2 className="profile-modal-title" style={{ margin: '0px' }}>Update Avatar</h2>
                    {
                        profileErrors.map((error, i) => (
                            <div className='authErrors' key={i}>
                                {error}
                            </div>
                        ))
                    }
                    {
                        errors.image &&
                        <div className='authErrors'>
                            {errors.image.message}
                        </div>
                    }

                    {isUploading && (
                        <div>
                            <div className='rounded-md bg-zinc-700 border-0' style={{ width: '150px', height: '4px' }}>
                                <div style={{
                                    width: `${progress}%`,
                                    height: '100%',
                                    transition: 'width 0.3s ease'
                                }} className='rounded-md bg-zinc-500 border-0' />
                            </div>
                            <p className='textPercent'>{progress}% updated</p>
                        </div>
                    )}

                    <div style={{ marginTop: '5px', marginBottom: '5px' }}>
                        {previewUrl ? ( // Previsualiza la imagen antes de guardarla
                            <img
                                src={previewUrl}
                                alt="Preview image"
                                title="Preview image"
                                style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '10px' }}
                            />
                        ) : (
                            <p></p>
                        )}
                    </div>
                    <input
                        type="file"
                        onChange={onFileChange} disabled={isUploading}
                        className='inputForm cursor-pointer'
                        accept="image/*"
                        {...register("image", {
                            required: "Select an image previously",
                            validate: (value) => value[0].size < 2000000 || "The file is too large, please select an image smaller than 2 MB"
                        })}
                        // Conectamos React Hook Form con la ref de este input para que al hacer click en el botón de abajo se ejecute como si hubieramos hecho click en el botón examinar del input, ref que llama el botón al hacer click y le dice que ejecute el input
                        ref={(e) => {
                            register("image").ref(e);
                            fileInputRef.current = e;
                        }}
                        style={{ display: 'none' }} // Ocultamos el input
                    />
                    <button type="button" disabled={isUploading} onClick={handleButtonClick} className="profile-btn-secondary w-full">Select Profile Picture</button>
                    <button type="submit" disabled={isUploading} className="profile-btn-secondary w-full">Update</button>
                    <button onClick={onClose} className="profile-btn-close">Close</button>
                </div>
            </div>
        </form >

    return jsxml
}

export default ImageUploadForm
